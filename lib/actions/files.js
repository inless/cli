'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	this.add('read file', function (resolve, reject, _path) {
		_fs2.default.readFile(_path3.default.resolve(_path), function (err, data) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
	this.add('read json', function (resolve, reject, _path) {
		try {
			_fs2.default.readFile(_path3.default.resolve(_path), function (err, data) {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					resolve(JSON.parse(data));
				}
			});
		} catch (err) {
			reject(err);
		}
	});
	this.add('write json', function (resolve, reject, _path) {
		var data = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

		try {
			data = JSON.stringify(data, true, '	');
			_fs2.default.writeFile(_path3.default.resolve(_path), data, function (err) {
				if (err) {
					console.log(err);
					reject(err);
				} else {
					resolve(data);
				}
			});
		} catch (err) {
			reject(err);
		}
	});
	this.add('write file', function (resolve, reject, _path) {
		var data = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

		_fs2.default.writeFile(_path3.default.resolve(_path), data, function (err) {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }