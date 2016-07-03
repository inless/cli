'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

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
	}]);

	return UI;
}();

exports.default = UI;