var React = require('react');
var textItem = require('./textItem');
//moment library used to calculate relative time since the item was added as a to-do
var moment = require('moment');

var textItem = React.createClass({

	handleClick(){
		this.props.onClick(this.props.address);
	},

	render(){

		var cn = "list-group-item";

		if(this.props.active){
			cn += " active-location";
		}

		return (
			<a className={cn} onClick={this.handleClick}>
				{this.props.todos}
				<span className="createdAt">{ moment(this.props.timestamp).fromNow() }</span>
			</a>
		)

	}

});

module.exports = textItem;
