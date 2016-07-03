'use strict';

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _cliClass = require('./classes/cli.class.js');

var _cliClass2 = _interopRequireDefault(_cliClass);

var _uiClass = require('./classes/ui.class.js');

var _uiClass2 = _interopRequireDefault(_uiClass);

var _actionsClass = require('./classes/actions.class.js');

var _actionsClass2 = _interopRequireDefault(_actionsClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _to = _process2.default.cwd();
var configs = require('../configs/cli-stack.json');

var ui = new _uiClass2.default();
var cli = new _cliClass2.default(configs);
var actions = new _actionsClass2.default();

actions.use(require('./actions/unpack.js'));

var _handler = void 0;

(_handler = function handler() {
	var command = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

	if (command) {
		command = command.toLowerCase();
	}
	switch (command) {
		case 'init':
			{
				ui.prompt({
					type: 'list',
					name: 'type',
					message: 'Create module. Select type: ',
					default: 'Component',
					choices: ['Application', 'Component', 'Library', 'Modificator', 'Plugin', 'Route', 'UI-Kit']
				}).then(function (_ref) {
					var type = _ref.type;

					_handler('init ' + type);
				}).catch(function (error) {
					console.log(error);
				});
			}break;
		case 'init application':
		case 'init component':
		case 'init library':
		case 'init modificator':
		case 'init plugin':
		case 'init route':
		case 'init ui-kit':
			{
				actions.run('unpack', command.split(' ')[1], _to).then(function (data) {
					console.log('done.');
				});
			}break;
		default:
			{
				if (command) {
					console.log('Wrong command: ' + _colors2.default.inverse(command) + '. Try again');
				}
				cli.getCommand(!command).then(_handler).catch(function (error) {
					return console.log(_colors2.default.bold(error + '.'));
				});
			}
	}
})();