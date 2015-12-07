// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
	// array case
	if (Array.isArray(obj)) {
		var partialArr = '[';
		for (var i = 0; i < obj.length; i++) {
			// if arr still iteratable
			if (obj[i] && typeof obj[i] === 'object') {
				var innerArr = stringifyJSON(obj[i])
				partialArr += `${innerArr},`;
			}
			// base case
			else {
				partialArr += typeof obj[i] === 'string' ? `"${obj[i]}",` : `${String(obj[i])},`;
			}
		}
		//close out
		partialArr += ']';
		//reassign
		return partialArr.toString().replace(/,(?=[\]])/gm, '');
	}
	// object case
	else if (obj && typeof obj === 'object') {
		var partialObj = '{';
		for (var item in obj) {
			// if obj still iteratable
			if (obj[item] && typeof obj[item] === 'object') {
				var innerObj = stringifyJSON(obj[item])
				partialObj += `"${String(item)}":${innerObj},`;
			}
			else if (typeof obj[item] === 'function') {
				return '{}';
			}
			// base case
			else {
				partialObj += `"${String(item)}":` + (typeof obj[item] === 'string' ? `"${obj[item]}",`: `${String(obj[item])},`);
			}
		}
		//close out
		partialObj += '}';
		//reassign
		return partialObj.toString().replace(/,(?=[\}])/gm, '');
	}
	// primative case
	else {
		return typeof obj === 'string' ? `"${obj}"` : String(obj);
	}
};