// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
	if (!arguments[1]) {
		var bodyNodes = document.body.childNodes;
		var docClassName = document.body.className.match(className)[0];
		var result = (docClassName === className ? [document.body] : []);
		return getElementsByClassName(className, bodyNodes, 0, result);
	}
	else if (arguments[2] === arguments[1].length) {
		return arguments[3];
	}
	else {
		var nodes = arguments[1];
		var i = arguments[2];
		var result = arguments[3];
		var nodeName = nodes[i].className;
		if (nodeName && nodeName.toString().match(className)) {
			result.push(nodes[i]);
		}
		else if (nodes[i].childNodes !== []) {
			getElementsByClassName(className, nodes[i].childNodes, 0, result);
		}
		return getElementsByClassName(className, nodes, i+1, result);
	}
};