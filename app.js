var express = require('express'),
bodyParser = require('body-parser'),
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var twilio = require('twilio'),
client = twilio('ACCOUNTSID', 'AUTHTOKEN'),
cronJob = require('cron').CronJob;

var Firebase = require('firebase'),
usersRef = new Firebase('{FIREBASEURL}/Users/');

var numbers = ['YOURPHONE','YOURFRIENDSPHONENUMBER'];

var textJob = new cronJob( '* * * * *', function(){
  client.sendMessage({to:'YOURPHONENUMBER', from:'YOURTWILIONUMBER', body:"test" }, function(err,data){});
}, null, true);

app.post('/message', function (req, res) {
  var resp = new twilio.TwimlResponse();
  resp.message('Thanks for subscribing!');
  res.writeHead(200, {
    'Content-Type':'text/xml'
  });
  res.end(resp.toString());
});

var todos = [];
usersRef.on('child_added', function(snapshot) {
numbers.push( snapshot.text() );
  console.log( 'Added a to-do ' + snapshot.text() );
});
