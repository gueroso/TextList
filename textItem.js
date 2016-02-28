// var React = require('react');
// var textItem = require('./textItem');
// //moment library used to calculate relative time since the item was added as a to-do
// var moment = require('moment');
//
// var textItem = React.createClass({
//
//   var TextList = React.createClass({
//     mixins: [ReactFireMixin],
//
//     getInitialState: function() {
//       return {
//         textlist: [],
//         task: ''
//       };
//     },
//
//     componentWillMount: function() {
//       var firebaseRef = new Firebase('https://textlist.firebaseio.com/textlist/');
//       this.bindAsArray(firebaseRef.limitToLast(25), 'textlist');
//     },
//
//     onChange: function(e) {
//       this.setState({task: e.target.value});
//     },
//
//     removeItem: function(key) {
//       var firebaseRef = new Firebase('https://textlist.firebaseio.com/textlist/');
//       firebaseRef.child(key).remove();
//     },
//
//
//     render: function() {
//       return (
//         <div>
//           <TextListTask className="textListComponent" tasks={ this.state.tasks } removeItem={ this.removeItem } />
//           <span className="createdAt">{ moment(this.props.timestamp).fromNow() }</span>
//         </div>
//       );
//     }
//   });
// }
// });
//
// module.exports = textItem;
