// var React = require('react');
// var textItem = require('./textItem');
//
// var textList = React.createClass({
//
// 	render(){
//
// 		var self = this;
//
// 		var todos = this.props.locations.map(function(l){
//
// 			var active = self.props.activeLocationAddress == l.address;
//
// 			// Notice that we are passing the onClick callback of this
// 			// LocationList to each LocationItem.
//
// 			return <textItem active={active} onClick={self.props.onClick} />
// 		});
//
// 		if(!todos.length){
// 			return null;
// 		}
//
// 		return (
// 			<div className="list-group col-xs-12 col-md-6 col-md-offset-3">
// 				<span className="list-group-item active">Saved To-Dos</span>
// 				{todos}
// 			</div>
// 		)
//
// 	}
//
// });
//
// module.exports = textList;
