var React = require('react');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');

var textListRef = new Firebase('https://textlist.firebaseIO.com/textlist/');

var listComponent = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li key={item.key}>{item.task}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

var textListComponent = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function () {
        return {
            listToDisplay: this.props.list;
        };
    },
    render: function () {
        return (
            <div>
                <h3>TODO</h3>
                <TodoList items={this.state.listToDisplay}/>
            </div>
        );
    }
});

module.exports = textList;
