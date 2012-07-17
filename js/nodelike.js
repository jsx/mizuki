/**
 * nodelike.js provides node-like environment to JavaScript interpreters
 * like js (SpiderMonkey shell), rhino, iv/lv5
 *
 * Usage:
 *   $ jsx --output a.jsx.js --executable node a.jsx
 *   $ js -f nodelike.js a.jsx.js
 *
 */
if (typeof console === "undefined") {
	console = {
		log: print,
		info: print,
		warn: print,
		error: print,

		time: function (label) {
			console.time._data[label] = Date.now();
		},
		timeEnd: function (label) {
			console.log(label + ": " + (Date.now() - console.time._data[label]) + "ms");
		},
	};
	console.time._data = {};
}

if (typeof process === "undefined") {
	process = {
		argv: [ /* interpreter = */ undefined, /* this file = */ undefined],
		env : {}
	};
	if (typeof version !== "undefined") {
		process.jsversion = version();
	}
	if (typeof arguments !== "undefined") {
		process.argv.push.apply(process.argv, arguments);
	}
	if (typeof quit !== "undefined") {
		process.exit = quit;
	}
}


