'use strict';

var _process = require('process');

var _process2 = _interopRequireDefault(_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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
actions.use(require('./actions/files.js'));
actions.use(require('./actions/npm.js'));

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
					_uiClass2.default.log(error);
				});
			}break;
		case 'init route':
			{
				(function () {
					_uiClass2.default.info('Copying files...');
					var params = {};
					ui.prompt([{
						type: 'input',
						name: 'name',
						message: 'Name: ',
						validate: function validate(value) {
							return !!value.match(/^[a-z0-9\-]+$/g);
						}
					}, {
						type: 'input',
						name: 'path',
						message: 'Path: ',
						validate: function validate(value) {
							return !!value.match(/^\/[a-z0-9\-_\/\:]+$/ig);
						}
					}, {
						type: 'confirm',
						name: 'redirect',
						message: 'Redirect? ',
						default: false
					}, {
						type: 'input',
						name: 'redirectURI',
						message: 'Redirect url ',
						when: function when(data) {
							return data.redirect;
						}
					}, {
						type: 'checkbox',
						name: 'access',
						message: 'Access: ',
						default: ['any'],
						choices: ['any', 'user', 'admin']
					}]).then(function (data) {
						if (typeof data.access == 'string') {
							data.access = [data.access];
						}
						if (data.redirect) {
							data.redirect = data.redirectURI;
							delete data.redirectURI;
						}
						params = data;
						return actions.run('unpack', command.split(' ')[1], _path2.default.resolve(_to, 'src', 'routes', params.name));
					}).then(function (data) {
						return actions.run('read json', _path2.default.resolve(_to, 'src', 'configs', 'routes.json'));
					}).then(function (data) {
						data.push(params);
						return actions.run('write json', _path2.default.resolve(_to, 'src', 'configs', 'routes.json'), data);
					}).then(function (data) {
						_uiClass2.default.log('done.');
					}).catch(function (error) {
						_uiClass2.default.error(error);
					});
				})();
			}break;
		case 'init application':
		case 'init component':
		case 'init library':
		case 'init modificator':
		case 'init plugin':
		case 'init ui-kit':
			{
				_uiClass2.default.info('Copying files...');
				actions.run('unpack', command.split(' ')[1], _to).then(function (data) {
					_uiClass2.default.info('Installation node modules...');
					return actions.run('npm install', _to);
				}).then(function (data) {
					_uiClass2.default.log('done.');
				}).catch(function (error) {
					_uiClass2.default.error(error);
				});
			}break;
		default:
			{
				if (command) {
					_uiClass2.default.log('Wrong command: ' + _colors2.default.inverse(command) + '. Try again');
				}
				cli.getCommand(!command).then(_handler).catch(function (error) {
					return _uiClass2.default.log(_colors2.default.bold(error + '.'));
				});
			}
	}
})();