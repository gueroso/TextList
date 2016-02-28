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
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Text list. " + "What would you like to be reminded of?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please ask for a reminder.";
    var shouldEndSession = false;

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
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    console.log("After var declarations");
    sessionAttributes = createReminderAttributes(time, date);

    if (repeatDay && reminder) {
        speechOutput = "You will be reminded to " + reminder + " every " + repeatDay;
        addRecurringReminderToFirebase(reminder, repeatDay, function() {
            repromptText = "Ask to be texted at a time and date.";
    
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    } else if (reminder && time && date) {
        speechOutput = "You will be reminded to " + reminder + " at " + time + " on " + date;
        addReminderToFirebase(reminder, time, date, function() {
            repromptText = "Ask to be texted at a time and date.";
    
            callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    } else {
        speechOutput = "You must specify a reminder, time, and date.";
        callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function createReminderAttributes(time, date) {
    return {
        time: time,
        date: date
    };
}

function addReminderToFirebase(reminder, time, date, callback) {
    var ref = new Firebase("https://textlist.firebaseio.com/");
    var pushRef = ref.push();

    pushRef.set({
        task: reminder,
        time: time,
        date: date,
        repeatDay: ""
    }, function(err) { 
        if (err) {
            console.log("Firebase error: " + err);
        } else {
            console.log("Done!");
            callback();
        }
    });
}

function addRecurringReminderToFirebase(reminder, repeatDay, callback) {
    var ref = new Firebase("https://textlist.firebaseio.com/");
    var pushRef = ref.push();

    pushRef.set({
        task: reminder,
        time: "",
        date: "",
        repeatDay: repeatDay
    }, function(err) { 
        if (err) {
            console.log("Firebase error: " + err);
        } else {
            console.log("Done!");
            callback();
        }
    });
}



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