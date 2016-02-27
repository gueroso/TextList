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

var todos = [];
usersRef.on('child_added', function(snapshot) {
  todos.push( snapshot.text() );
  console.log( 'Added a to-do ' + snapshot.text() );
});


var textList = new cronJob( '* * * * *', function(){
  for(var i = 0; i < todos.length; i++){
    client.sendMessage({to:'YOURPHONENUMBER', from:'YOURTWILIONUMBER', body:"test" }, function(err,data){
      console.log(data.body);
    });
  }
}, null, true);



app.post('/message', function (req, res) {
  var resp = new twilio.TwimlResponse();
  if(req.body.Body.trim().toLowerCase() === 'complete' || 'done'){
    var fromNum = req.body.From;
    if(numbers.indexOf(fromNum) !== -1){
      resp.message('you have already completed this task');
    } else {
      resp.message('thanks for taking the time to complete your task. I will stop reminding you about this task.');
    } else {
      resp.message('Welcome! It looks like your to-do list is currently empty. Please communicate with me (Alexa) through your Amazon Echo to schedule new text message reminders!');
    }
    res.writeHead(200, {
      'Content-Type':'text/xml'
    });
    res.end(resp.toString());
  });

  var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
  });
