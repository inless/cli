'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = normalize;

var _damerauLevenshteinGit = require('damerau-levenshtein-git');

var _damerauLevenshteinGit2 = _interopRequireDefault(_damerauLevenshteinGit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalize() {
	var args = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
	var stack = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	var corresponds = [];
	var commands = [];
	if (!args.length) {
		return {
			corresponds: corresponds,
			commands: commands
		};
	} else {
		var param = stack.map(function (e) {
			var ret = e.aliases.concat([e.command]).map(function (e) {
				var cmd = args[0].toLowerCase();
				if (cmd.length < e.length) {
					cmd += new Array(e.length - cmd.length).fill(' ').join('');
				} else if (cmd.length > e.length) {
					cmd = cmd.substr(0, e.length);
				}
				return cmd.length / (0, _damerauLevenshteinGit2.default)(cmd, e) - 1;
			}).reduce(function (a, b) {
				return b > a ? b : a;
			});
			return Object.assign({
				correspond: ret
			}, e);
		}).reduce(function (a, b) {
			return b.correspond > a.correspond ? b : a;
		});
		corresponds.push(param.correspond);
		commands.push(param.command);
		if (param.childs) {
			var x = normalize(args.slice(1), param.childs);
			corresponds = corresponds.concat(x.corresponds);
			commands = commands.concat(x.commands);
			return {
				corresponds: corresponds,
				commands: commands
			};
		} else {
			return {
				corresponds: corresponds,
				commands: commands
			};
		}
	}
}