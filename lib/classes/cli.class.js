'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cli = require('cli');

var _cli2 = _interopRequireDefault(_cli);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _normalizeCommand = require('../libs/normalizeCommand.js');

var _normalizeCommand2 = _interopRequireDefault(_normalizeCommand);

var _uiClass = require('./ui.class.js');

var _uiClass2 = _interopRequireDefault(_uiClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ui = new _uiClass2.default();

var CLI = function () {
	function CLI() {
		var configs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

		_classCallCheck(this, CLI);

		this.configs = configs;
	}

	_createClass(CLI, [{
		key: 'getCommand',
		value: function getCommand() {
			var _this = this;

			var params = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
			var always = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

			return new Promise(function (resolve, reject) {
				var run = function run(args) {
					var data = (0, _normalizeCommand2.default)(args, _this.configs);
					_this.validation(data).then(function (data) {
						resolve(data);
					}).catch(reject);
				};
				var getCommand = function getCommand() {
					_this.readCommand(always).then(function (args) {
						run(args);
					});
				};
				if (params) {
					_this.getArguments().then(function () {
						var args = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

						if (args.length) {
							run(args);
						} else {
							getCommand();
						}
					});
				} else {
					getCommand();
				}
			});
		}
	}, {
		key: 'readCommand',
		value: function readCommand() {
			var _this2 = this;

			var always = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			return new Promise(function (resolve, reject) {
				ui.prompt({
					type: "input",
					name: "command",
					message: "inless:> "
				}).then(function (_ref) {
					var _ref$command = _ref.command;
					var command = _ref$command === undefined ? null : _ref$command;

					if (!command && always) {
						_this2.readCommand(always).then(resolve);
					} else {
						resolve(command.split(' '));
					}
				});
			});
		}
	}, {
		key: 'validation',
		value: function validation(data) {
			return new Promise(function (resolve, reject) {
				var min = data.corresponds.reduce(function (a, b) {
					return a < b ? a : b;
				});
				var command = data.commands.join(' ');
				if (min < Infinity) {
					ui.prompt({
						type: "confirm",
						name: "answer",
						message: 'Are you sure would like input ' + _colors2.default.inverse(command),
						default: min > 1
					}).then(function (_ref2) {
						var answer = _ref2.answer;

						if (answer) {
							resolve(command);
						} else {
							reject('Canceled');
						}
					});
				} else {
					resolve(command);
				}
			});
		}
	}, {
		key: 'getArguments',
		value: function getArguments() {
			var options = _cli2.default.parse({
				// port: ['p', 'Listen on this port', 'number', 8080]
			});
			return new Promise(function (resolve, reject) {
				_cli2.default.main(function (args, options) {
					resolve(args);
				});
			});
		}
	}]);

	return CLI;
}();

exports.default = CLI;