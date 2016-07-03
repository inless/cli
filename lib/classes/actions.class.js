'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _uiClass = require('../classes/ui.class.js');

var _uiClass2 = _interopRequireDefault(_uiClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Actions = function () {
	function Actions() {
		_classCallCheck(this, Actions);

		this._actions = {};
	}

	_createClass(Actions, [{
		key: 'use',
		value: function use() {
			var module = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

			if (module.call) {
				module.call(this);
			} else if (module.default) {
				module.default.call(this);
			}
		}
	}, {
		key: 'add',
		value: function add() {
			var action = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
			var method = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

			if (this._actions[action]) {
				_uiClass2.default.warn('Conflict in action name: ' + action + '!');
			}
			if (action) {
				return this._actions[action] = method;
			} else {
				return method;
			}
		}
	}, {
		key: 'run',
		value: function run() {
			var _this = this;

			for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				params[_key - 1] = arguments[_key];
			}

			var action = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

			_uiClass2.default.log(_colors2.default.dim('run task: "' + action + '", ' + (params.length ? 'with params: ' + params.join(', ') : 'without params') + '.'));
			return new Promise(function (resolve, reject) {
				if (typeof _this._actions[action] !== 'function') {
					reject('wrong action!');
				} else {
					var _actions$action;

					(_actions$action = _this._actions[action]).call.apply(_actions$action, [_this].concat(_toConsumableArray([resolve, reject].concat(params))));
				}
			}).catch(function (error) {
				error = 'in action "' + action + '" error: ' + error;
				_uiClass2.default.error(_colors2.default.red(error));
				return Promise.reject(error);
			});
		}
	}]);

	return Actions;
}();

exports.default = Actions;