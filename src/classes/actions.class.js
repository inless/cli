
import colors from 'colors';

export default class Actions {
	constructor() {
		this._actions = {};
	}
	use(module = (function() {})) {
		if(module.call) {
			module.call(this);
		} else if(module.default) {
			module.default.call(this);
		}
	}
	add(action = null, method = (function() {})) {
		if(this._actions[action]) {
			console.warn(`Conflict in action name: ${action}!`);
		}
		if(action) {
			return this._actions[action] = method;
		} else {
			return method;
		}
	}
	run(action = null, ...params) {
		console.log(colors.dim(`run task: "${action}", ${params.length ? 'with params: '+params.join(', ') : 'without params'}.`));
		return new Promise((resolve, reject)=> {
			if(typeof this._actions[action] !== 'function') {
				reject('wrong action!');
			} else {
				this._actions[action].call(this, ...[resolve, reject].concat(params));
			}
		}).catch((error)=> {
			error = `in action "${action}" error: ${error}`;
			console.error(colors.red(error));
			return Promise.reject(error);
		});
	}
}
