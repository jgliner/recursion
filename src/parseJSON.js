// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
	console.log('Passed In:', json)
	var result;
	var arrayMode = function(sub) {
		result = [];
		if (sub !== '') {
			// replace floating quotation marks and split by comma
			sub = sub.replace(/\b\"(?!")|\"(?!")\b|\s(?=")|\s$/igm, '').split(',');
			for (var i = 0; i < sub.length; i++) {
				// if still iteratable
				if (sub[i].includes('{') || sub[i].includes('[')) {
					sub[i] = parseJSON(sub[i])
				}
			}
			result = sub;
		}
		// check for special characters/objects
		result = checker(result);
		return result;
	}
	var objMode = function(sub) {
		result = {};
		if (sub !== '') {
			// replace floating quotation marks and split by comma
			sub = sub.replace(/\b\"(?!")|\"(?!")\b|\s(?=")|\s$/igm, '').split(/\,(?!(?:\s[A-z])|(?:[A-Z]\]))/igm);
			// if we can still iterate through the object
			if (sub.length !== 1) {
				// for each item split by the comma
				for (var i = 0; i < sub.length; i++) {
					// split by colon to get key (sub[i][0]) and val (sub[i][1])
					sub[i] = sub[i].split(':');
					// if nested
					if (sub[i][1].includes('{') || sub[i][1].includes('[')) {
						sub[i][1] = parseJSON(sub[i][1]);
					}
					// assign to new object, checking for empty string
					sub[i][1] !== `""` ? result[sub[i][0]] = sub[i][1] : result[sub[i][0]] = "";
				}
			}
			else {
				sub = sub[0].split(':');
				// if new split has an odd number of items (implies object is embedded)
				if (sub.length % 2 !== 0) {
					// lop off the key, combine all other values into a new obj, send back through
					sub[1] = parseJSON(sub.slice(1).join().replace(',',':'));
				}
				// if new split is an array
				else if (sub[1].includes('[')) {
					sub[1] = parseJSON(sub[1]);
				}
				sub[1] !== `""` ? result[sub[0]] = sub[1] : result[sub[0]] = "";
			}
		}
		result = checker(result)
		return result;
	}
	var checker = function(parsed) {
		// loop through the new parsed collection
		if (Array.isArray(parsed)) {
			for (var i = 0; i < parsed.length; i++) {
				if ( typeof parsed[i] === 'string' && parsed[i].match(/[\d.-]+/igm) ) {
					parsed[i] = parseFloat(parsed[i]);
				}
				else if (parsed[i] === 'true') {
					parsed[i] = true;
				}
				else if (parsed[i] === 'false') {
					parsed[i] = false;
				}
				else if (parsed[i] === 'null') {
					parsed[i] = null;
				}
				else if (parsed[i] === 'undefined') {
					parsed[i] = undefined;
				}
				// for escaped chars
				else if (typeof parsed[i] === 'string' && parsed[i].match(/\\/igm)) {
					parsed[i] = parsed[i].replace(/\\(?=[A-Z])/igm, '"').replace(/\\(?![\\]\\)|^\"|\"$/igm, '');
				}
			}
		}
		else {
			for (var item in parsed) {
				if ( typeof parsed[item] === 'string' && parsed[item].match(/[\d.-]+/igm) ) {
					parsed[item] = parseFloat(parsed[item]);
				}
				else if (parsed[item] === ' true') {
					parsed[item] = true;
				}
				else if (parsed[item] === ' false') {
					parsed[item] = false;
				}
				else if (parsed[item] === ' null') {
					parsed[item] = null;
				}
				else if (parsed[item] === ' undefined') {
					parsed[item] = undefined;
				}
				else if (typeof parsed[item] === 'string' && parsed[item].match(/\\/igm)) {
					parsed[item] = parsed[item].replace(/\\(?=[A-Z])/igm, '"').replace(/\\(?![\\]\\)|^\"|\"$/igm, '');
				}
			}
		}
		return parsed;
	}
	// determine whether to send the item into array or obj mode
	// take first instance of [ or { and last instance of ] or }
	for (var i = 0; i < json.length; i++) {
		// if array
		if (json[i] === '[') {
			return arrayMode(json.slice(json.indexOf('[')+1, json.lastIndexOf(']')));
		}
		// if obj
		else if (json[i] === '{') {
			return objMode(json.slice(json.indexOf('{')+1, json.lastIndexOf('}')));
		}
	}
	return result;
};