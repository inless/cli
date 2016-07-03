'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	this.add('npm install', function (resolve, reject, _path) {
		var child = (0, _child_process.exec)('npm install .', {
			cwd: _path
		}, function (error, stdout, stderr) {
			if (error !== null) {
				reject(error.toString());
			} else {
				resolve(true);
			}
		});
	});
};

var _child_process = require('child_process');