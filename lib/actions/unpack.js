'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	this.add('unpack', function (resolve, reject, type, _to) {
		var _path = _path3.default.resolve(_from, type);
		_fs2.default.exists(_path, function (exists) {
			if (exists) {
				(0, _ncp.ncp)(_path, _to, { clobber: false }, function (err) {
					if (err) {
						reject(err.toString());
					} else {
						resolve(true);
					}
				});
			} else {
				reject('wrong type: ' + type);
			}
		});
	});
};

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _ncp = require('ncp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _from = _path3.default.resolve(__dirname, '..', '..', 'sources');