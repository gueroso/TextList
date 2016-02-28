var React = require('react');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');
var textItem = require('./textItem');


var textList = new Firebase('{textlist.firebaseIO.com}/textlist/');

var TextListTask = React.createClass({
  render: function() {
    var _this = this;
    // var createItem = function(item, index) {
    //   // return (
    //   // //  <p>hi.</p>
    //   // // //  <li key={ index }>
    //   // //     { item.task }
    //   // //     <span onClick={ _this.props.removeItem.bind(null, item['.key']) }
    //   // //           style={{ color: 'red', marginLeft: '10px', cursor: 'pointer' }}>
    //   // //       X
    //   // //     </span>
    //   // //   </li>
    //   // );
    // };
    //return <ul>{ this.props.items.map(createItem) }</ul>;
  }
});


var TextList = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      textlist: [],
      task: ''
    };
  },

  componentWillMount: function() {
    var firebaseRef = new Firebase('https://textlist.firebaseio.com/textlist/');
    this.bindAsArray(firebaseRef.limitToLast(25), 'textlist');
  },

  onChange: function(e) {
    this.setState({task: e.target.value});
  },

  removeItem: function(key) {
    var firebaseRef = new Firebase('https://textlist.firebaseio.com/textlist/');
    firebaseRef.child(key).remove();
  },


  render: function() {
    // return (
    //   <div>
    //     <TextListTask items={ this.state.items } removeItem={ this.removeItem } />
    //   </div>
    // );
  }
});


module.exports = textList;

//ReactDOM.render(<TextList />, document.getElementById('textlist'));
