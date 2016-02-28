var Firebase = require('firebase');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.87de1949-e52a-4bea-ad04-cdefa50d9ff5") {
            context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent, intentName = intentRequest.intent.name;

    console.log("Name: " + intentName);

    // Dispatch to your skill's intent handlers
    if ("RemindMeAtIntent" === intentName) {
        console.log("Inside if statement");
        remindUser(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {}, cardTitle = "Welcome",
        speechOutput = "Welcome to Text list. " + "What would you like to be reminded of?",
        repromptText = "Please ask for a reminder.", shouldEndSession = false;

    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function remindUser(intent, session, callback) {
    var cardTitle = intent.name;
    var reminder = intent.slots.Reminder.value;
    var time = intent.slots.Time.value;
    var date = intent.slots.Date.value;
    var repeatDay = intent.slots.RepeatDay.value;
    
    var duration = intent.slots.Duration.value, repromptText = "", sessionAttributes = {},
        shouldEndSession = false, speechOutput = "";

    sessionAttributes = createReminderAttributes(reminder, time, date, repeatDay);

    if (reminder && repeatDay) {
        console.log("recurring");
        date = "";
        time = "12:00";
        speechOutput = "You will be reminded to " + reminder + " every " + repeatDay + ". Ask again or say Alexa, quit.";
        addReminderToFirebase(reminder, time, repeatDay, function () {
            repromptText = "Ask to be texted or say Alexa, quit.";
    
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    } else if (reminder && duration) {
        console.log("duration");
        repeatDay = "";
        
        var delayedDate = 0;
        convertDurationToDateFromNow(duration, function(delayed) {
            delayedDate = delayed;
            
            var d = new Date(delayedDate);
            speechOutput = "You will be reminded to " + reminder + " on " + d.toDateString() + " at " + d.toTimeString() + ". Ask again or say quit.";
        
            addReminderToFirebase(reminder, d.toTimeString(), delayedDate, repeatDay, function() {
                repromptText = "Ask to be texted or say Alexa, quit.";
        
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            });
        });
    } else if (reminder && time && date) {
        console.log("normal");
        repeatDay = "";
        speechOutput = "You will be reminded to " + reminder + " at " + time + " on " + date + ". Ask again or say quit.";
        
        var delayedDate = Date.parse(date + " " + time);
        addReminderToFirebase(reminder, time, delayedDate, repeatDay, function () {
            repromptText = "Ask to be texted or say Alexa, quit.";
    
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    } else if (reminder && time) {
        console.log("time");
        repeatDay = "";
        var today = new Date();

        var timeNow = today.toTimeString();

        if (Date.parse('01/01/2011 ' + time) > Date.parse('01/01/2011 ' + timeNow)) {
            speechOutput = "You must specify a time in the future.";
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        } else {
            speechOutput = "You will be reminded to " + reminder + " at " + time;

            delayedDate = Date.parse(today.toDateString() + " " + time);
            addReminderToFirebase(reminder, time, delayedDate, repeatDay, function () {
                repromptText = "Ask to be texted or say Alexa, quit.";
    
                callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            });
        }
    } else {
        speechOutput = "You must specify a reminder, with time, time and date, or time delay.";
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function createReminderAttributes(task, time, date, repeatDay) {
    return {
        task: task,
        time: time,
        date: date,
        repeatDay: repeatDay
    };
}

function addReminderToFirebase(reminder, time, date, repeatDay, callback) {
    var ref = new Firebase("https://textlist.firebaseio.com/"), pushRef = ref.push();

    pushRef.set({
        task: reminder,
        time: time,
        date: date,
        repeatDay: repeatDay
    }, function (err) {
        if (err) {
            console.log("Firebase error: " + err);
        } else {
            console.log("Done!");
            callback();
        }
    });
}

function convertDurationToDateFromNow(duration, callback) {
    duration.replace("P", "");
    duration.replace("T", "");

    var delayInMSeconds = 0;
    console.log("Duration" + duration);

    for (var i = 0; i < duration.length; ++i) {
        if (duration.charAt(i) == "Y") {
            delayInMSeconds += (parseInt(duration.charAt(i-1))) * 31557600000;
            console.log("Delay: " + delayInMSeconds);
        }
        if (duration.charAt(i) == "M") {
            delayInMSeconds += (parseInt(duration.charAt(i-1))) * 2592000000;
            console.log("Delay: " + delayInMSeconds);
        }
        if (duration.charAt(i) == "W") {
            delayInMSeconds += (parseInt(duration.charAt(i-1))) * 604800000;
            console.log("Delay: " + delayInMSeconds);
        }
        if (duration.charAt(i) == "D") {
            delayInMSeconds += (parseInt(duration.charAt(i-1))) * 86400000;
            console.log("Delay: " + delayInMSeconds);
        }
        if (duration.charAt(i) == "H") {
            delayInMSeconds += (parseInt(duration.charAt(i-1))) * 3600000;
            console.log("Delay: " + delayInMSeconds);
        }
        if (duration.charAt(i) == "M") {
            delayInMSeconds += (parseInt(duration.charAt(i-1))) * 60000;
            console.log("Delay: " + delayInMSeconds);
        }
        if (duration.charAt(i) == "S") {
            delayInMSeconds += (parseInt(duration.charAt(i-1))) * 1000;
            console.log("Delay: " + delayInMSeconds);
        }
    }
    
    var now = new Date();
    console.log("new Date: " + now);
    var delayedDate = now.getTime() + delayInMSeconds;
    
    console.log("offsetDate: " + delayedDate);
    
    callback(delayedDate);
}

function z(n){return (n < 10? '0' : '') + n;}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}