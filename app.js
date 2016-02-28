var React = require('react');
var ReactFireMixin = require('reactfire');

var alexaButton = require('./alexaButton');
var textList = require('./textList');

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

// Twilio Credentials
var accountSid = 'ACd35de8e6c49a66973705c9b2ae34faba';
var authToken = 'c7bbf15952876b9684ece3bb789d8b0c';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

client.messages.create({
    to: "+17065806048",
    from: "+19543712870",
    body: "Time to kick it into overdrive.",
    mediaUrl: "http://www.foodinnovationsolutions.com/wp-content/uploads/2014/09/Rocket2.jpg",
}, function(err, message) {
    console.log(message.sid);
});

var Firebase = require('firebase'),
  textList = new Firebase('{textlist.firebaseIO.com}/textlist/');

  // var YOURPHONE = "+17065806048"
  // var YOURFRIENDSPHONENUMBER = "+19545585152"
  // var TEAM = [YOURPHONE,YOURFRIENDSPHONENUMBER];

  //
  // var textListComponent = React.createClass({
  //   mixins: [ReactFireMixin],
  //
  // getInitialState: function() {
  //     return {
  //       textlist: []
  //     };
  //   },
  //   componentWillMount: function() {
  //     var ref = new Firebase("https://textlist.firebaseio.com/textlist");
  //     this.bindAsArray(ref, "textlist");
  //   },
  //   render: function() {
  //     var textlist = this.state.textlist.map(function(textlist) {
  //   return (
  //     <li key={ textlist['.key'] }>
  //       <b>{ textlist.uid }</b> says { textlist.task }
  //     </li>
  //   );
  // });
  // return <ul>{ textlist }</ul>;
  //   }
  // });

// var todos = [];
// usersRef.on('child_added', function(snapshot) {
//   todos.push( snapshot.text() );
//   console.log( 'Added a to-do ' + snapshot.text() );
// });


// var textList = new cronJob( '* * * * *', function(){
//   for(var i = 0; i < todos.length; i++){
//     client.sendMessage({to:'YOURPHONENUMBER', from:'YOURTWILIONUMBER', body:"test" }, function(err,data){
//       console.log(data.body);
//     });
//   }
// }, null, true);



// app.post('/message', function (req, res) {
//   var resp = new twilio.TwimlResponse();
//   if(req.body.Body.trim().toLowerCase() === 'complete' || 'done'){
//     var fromNum = req.body.From;
//     if(numbers.indexOf(fromNum) !== -1){
//       resp.message('you have already completed this task');
//     } else {
//       resp.message('thanks for taking the time to complete your task. I will stop reminding you about this task.');
//     } //else {
//       //resp.message('Welcome! It looks like your to-do list is currently empty. Please communicate with me (Alexa) through your Amazon Echo to schedule new text message reminders!');
//     //}
//     res.writeHead(200, {
//       'Content-Type':'text/xml'
//     });
//     res.end(resp.toString());
//   });

//   var server = app.listen(3000, function() {
//     console.log('Listening on port %d', server.address().port);
//   });
//
//
// var App = React.createClass({
//         getInitialState(){
//
//         // Extract existing to-dos from local storage (DynamoDB)
//
//         var todos = [];
//
//         if (localStorage.todos){
//                 todos = JSON.parse(localStorage.todos);
//         }
//
//         // return an example task if list is empty
//
//         return{
//           todos: todos,
//           scheduledCompletion: {
//             date: DateNow();
//             time: date.getTime();
//           }
//         };
//
//       },
//
//       toggleRecurring(todos){
//         if(this.isTodoInRecurring(todos)){
//           this.removeFromRecurring(todos);
//         }
//         else{
//           this.addToRecurring(todos);
//       }
//     },
//
//     addToRecurring(todos){
//
//       var recurring = this.state.recurring;
//       var d = new Date();
//
//       recurring.push({
//         day: d.getDay();
//         time: d.getTime();
//       });
//
//       this.setState({
//         recurring: recurring;
//       });
//
//       localStorage.recurring = JSON.stringify(favorites);
//     },
//
//     removeFromRecurring(todos){
//       var recurring = this.state.recurring;
//       var index = -1;
//
//       for(var i = 0; recurring.length; i++){
//
//         if(recurring[i].todos == todos){
//           index = i;
//           break;
//         }
//       }
//
//         // If it was found, remove task from the recurring array
//
//         if(index !== -1){
//
//           favorites.splice(index, 1);
//
//           this.setState({
//             recurring: recurring;
//           });
//
//           localStorage.recurring = JSON.stringify(recurring);
//         }
//       },
//
//       isTodoInRecurring(todos){
//
//         var recurring = this.state.recurring;
//
//         for(var i = 0; i < recurring.length ; i++){
//
//           if(recurring[i].todos == todos){
//             return true;
//           }
//         }
//         return false;
//       },
//
//       render(){
//
//         return (
//
//           <div>
//             <h1>Your Scheduled Text Messages</h1>
//
//             <textList todos={this.state.recurring} activeTodos={this.state.scheduledCompletion} />
//
//           </div>
//
//         );
//
//       };
//
//
// });
//
// module.exports = App;
