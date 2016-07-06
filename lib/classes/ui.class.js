'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = new _winston2.default.Logger({
	level: 'debug',
	transports: [new _winston2.default.transports.Console({
		timestamp: function timestamp() {
			return _colors2.default.grey('[' + new Date().toISOString().split('T')[1].slice(0, -1) + ']');
		}
	})]
});

var UI = function () {
	function UI() {
		_classCallCheck(this, UI);

		this.engine = _inquirer2.default;
	}

	_createClass(UI, [{
		key: 'prompt',
		value: function prompt() {
			var commands = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

			if (!(commands instanceof Array)) {
				commands = [commands];
			}
			return _inquirer2.default.prompt(commands);
		}
	}], [{
		key: 'log',
		value: function log() {
			logger.info.apply(logger, _toConsumableArray(new (Function.prototype.bind.apply(Array, [null].concat(Array.prototype.slice.call(arguments))))().map(function (e) {
				return typeof e == 'string' ? _colors2.default.green(e) : e;
			})));
		}
	}, {
		key: 'info',
		value: function info() {
			logger.info.apply(logger, _toConsumableArray(new (Function.prototype.bind.apply(Array, [null].concat(Array.prototype.slice.call(arguments))))().map(function (e) {
				return typeof e == 'string' ? _colors2.default.cyan(e) : e;
			})));
		}
	}, {
		key: 'warn',
		value: function warn() {
			logger.warn.apply(logger, _toConsumableArray(new (Function.prototype.bind.apply(Array, [null].concat(Array.prototype.slice.call(arguments))))().map(function (e) {
				return typeof e == 'string' ? _colors2.default.orange(e) : e;
			})));
		}
	}, {
		key: 'error',
		value: function error() {
			logger.error.apply(logger, _toConsumableArray(new (Function.prototype.bind.apply(Array, [null].concat(Array.prototype.slice.call(arguments))))().map(function (e) {
				return typeof e == 'string' ? _colors2.default.red(e) : e;
			})));
		}
	}, {
		key: 'debug',
		value: function debug() {
			logger.debug.apply(logger, _toConsumableArray(new (Function.prototype.bind.apply(Array, [null].concat(Array.prototype.slice.call(arguments))))().map(function (e) {
				return typeof e == 'string' ? _colors2.default.grey(e) : e;
			})));
		}
	}]);

	return UI;
}();

exports.default = UI;