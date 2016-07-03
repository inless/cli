'use strict';

var _cliClass = require('./classes/cli.class.js');

var _cliClass2 = _interopRequireDefault(_cliClass);

var _uiClass = require('./classes/ui.class.js');

var _uiClass2 = _interopRequireDefault(_uiClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configs = require('../configs/cli-stack.json');

var ui = new _uiClass2.default();
var cli = new _cliClass2.default(configs);

var handler = function handler() {
	var command = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	switch (command) {
		case 'init':
			{
				console.log('new:)');
			}break;
		default:
			{
				cli.getCommand().then(handler).catch(function (error) {
					return console.log(error + '.');
				});
			}
	}
	console.log(command);
};

handler();