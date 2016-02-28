var React = require('react');
var ReactFireMixin = require('reactfire');

var alexaButton = require('./components/alexaButton');
var textList = require('./components/textList');

var Firebase = require('firebase'),
    textListRef = new Firebase('https://www.textlist.firebaseIO.com/textlist/');

var CronJob = require('cron');
var JSON = require('jsonify');

// Twilio Credentials
var accountSid = 'ACd35de8e6c49a66973705c9b2ae34faba';
var authToken = 'c7bbf15952876b9684ece3bb789d8b0c';
var userPhone = "+17065806048";

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

var sendMessage = function (message) {
    twilioClient.messages.create({
        to: "+17065806048",
        from: "+19543712870",
        body: message
    }, function (err, message) {
        console.log(message.sid);
    });
};

var cronGuy = new CronJob('* * * * *', function () {
    for (var i = 0; i < reminders.length; i++) {
        sendMessage(reminders[i].task);
    }
}, null, true);

var App = React.createClass({
    getInitialState() {
        return {
            recurring = [];

            if (localStorage.recurring) {
                recurring = JSON.parse(localStorage.recurring);
            }
        };
    },
    toggleRecurring(reminder) {
        if (this.isReminderInRecurring(reminder)) {
            this.removeFromRecurring(reminder);
        } else {
            this.addToRecurring(reminder);
        }
    },
    addToRecurring(reminder) {
        var recurring = this.state.recurring;

        recurring.push(reminder);

        this.setState({
            recurring: recurring
        });

        localStorage.recurring = JSON.stringify(recurring);
    },
    removeFromRecurring(reminder) {
        var recurring = this.state.recurring;
        var index = -1;

        for (var i = 0; recurring.length; i++) {

            if (recurring[i].key == reminder.key) {
                index = i;
                break;
            }
        }

        if (index !== -1) {
            favorites.splice(index, 1);

            this.setState({
                recurring: recurring;
            });

            localStorage.recurring = JSON.stringify(recurring);
        }
    },
    isReminderInRecurring(reminder) {
        var recurring = this.state.recurring;

        for (var i = 0; i < recurring.length; i++) {
            if (recurring[i].key == reminder.key) {
                return true;
            }
        }
        return false;
    },
    componentWillMount: function() {
        this.bindAsArray(textListRef, "reminders");
    },
    render() {
        return (
                <div>
                    <h1> Your Scheduled Text Messages </h1>
                    <textList listToDisplay={this.state.reminders}/>
                    <h1> Your recurring Text Messages </h1>
                    <textList listToDisplay={this.state.recurring}/>
                </div>
        );  
    };
});

ReactDOM.render(<App/>, document.getElementById('main'));