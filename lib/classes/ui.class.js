'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
			_winston2.default.log.apply(_winston2.default, arguments);
		}
	}, {
		key: 'info',
		value: function info() {
			_winston2.default.info.apply(_winston2.default, arguments);
		}
	}, {
		key: 'warn',
		value: function warn() {
			_winston2.default.warn.apply(_winston2.default, arguments);
		}
	}, {
		key: 'error',
		value: function error() {
			_winston2.default.error.apply(_winston2.default, arguments);
		}
	}, {
		key: 'debug',
		value: function debug() {
			_winston2.default.debug.apply(_winston2.default, arguments);
		}
	}]);

	return UI;
}();

exports.default = UI;