

import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes.js';
import { Router, Route, browserHistory } from 'react-router';

// import SocketIO from 'socket.io-client';
// import EventEmitter from 'events';

// class Loader extends EventEmitter {
// 	constructor() {
// 		super();
// 		this.socket = SocketIO();
// 		this._oldLocation = null;
// 		this.symbol = Symbol('Loader');
// 		this._ids = {};
// 		this.socket.on('connect', ()=> {
// 			console.log('connect');
// 		});
// 		this.socket.on('disconnect', ()=> {
// 			console.log('disconnect');
// 		});
// 		this.socket.on('preData', (data)=> {
// 			if(this._ids[data.id]) {
// 				this._ids[data.id](data);
// 				delete this._ids[data.id];
// 			}
// 		});
// 	}
// 	socketCall(url, query) {
// 		return new Promise((resolve, reject)=> {
// 			var id = (new Date%1e8).toString(32)+(Math.random()*1e5|0).toString(32);
// 			this.socket.emit('preData', {
// 				id,
// 				url,
// 				data: query
// 			});
// 			this._ids[id] = (data)=> {
// 				resolve(data);
// 			};
// 		});
// 	}
// 	preData(url, topopen = false) {
// 		if(topopen /* || window.location.href == this._oldLocation*/ ) {
// 			console.log('topopen');
// 			this.emit('preData', window[Symbol.for('preData')]||{});
// 		} else {
// 			this._oldLocation = url;
// 			this.socketCall(url, {}).then((data)=> {
// 				document.title = data.title;
// 				this.emit('preData', data.data);
// 			});
// 		}
// 	}
// 	subscribe(element, cb) {
// 		element[this.symbol] = true;
// 		let s = Symbol.for('preData');
// 		if(!element[s]) {
// 			element[s] = true;
// 			this.on('preData', (data)=> {
// 				if(element[this.symbol]) {
// 					cb(data);
// 				} else {
// 					console.log('componentWillUnmount');
// 				}
// 			});
// 		}
// 	}
// 	unsubscribe(element) {
// 		element[this.symbol] = false;
// 	}
// }


// var test = new Loader();

// console.log('>>>', test);

import Connect from './connect.class.js';
import PreData from './preData.client.class.js';

var connect = new Connect();
var preData = new PreData(connect);




var mount = Symbol('mount');
var inited = Symbol('inited');

var mixins = [
	{
		displayName: 'Route',
		getState(name) {
			let ret;
			if(!this.state) {
				ret = null;
			} else {
				switch(typeof this.state[name]) {
					case "undefined": ret = null; break;
					default: ret = this.state[name];
				}
			}
			return ret;
		},
		redirect(url, query) {
			url = url || '/';
			query = query || {};
			this.history.pushState(null, url, query);
		},
		getInitialState() {
			let url = `${this.props.location.pathname}${this.props.location.search}${this.props.location.hash}`;
			if(!this[inited]) {
				this[inited] = true;
				preData.on('data', (data)=> {
					if(this[mount]) {
						this.setState(data);
					}
				});
				return preData.base(url);
			}
			return preData.base(url);
		},
		componentDidUpdate() {
				preData.load(`${this.props.location.pathname}${this.props.location.search}${this.props.location.hash}`);
		},
		componentDidMount() {
			this[mount] = true;
		},
		componentWillUnmount() {
			this[mount] = false;
		}
	}
];

var mixinsL = [
	{
		displayName: 'Layout',
		getState(name) {
			let ret;
			if(!this.state) {
				ret = null;
			} else {
				switch(typeof this.state[name]) {
					case "undefined": ret = null; break;
					default: ret = this.state[name];
				}
			}
			return ret;
		},
		redirect(url, query) {
			url = url || '/';
			query = query || {};
			this.history.pushState(null, url, query);
		},
		getInitialState() {
			if(!this[inited]) {
				preData.on('data', (data)=> {
					if(this[mount]) {
						this.setState(data);
					}
				});
			}
			return preData.base(null);
		},
		componentDidMount() {
			this[mount] = true;
		},
		componentWillUnmount() {
			this[mount] = false;
		}
	}
];

let layout = require('../layout/handler.js').default;

layout.mixins = mixinsL;

console.log(':-)');

ReactDOM.render(
	(<Router history={browserHistory}>
		<Route path="/" component={React.createClass(layout)}>
			{Routes(mixins).map((route, i)=> <Route
				path={route.path}
				component={route.component}
				key={i}
			/>)}
		</Route>
	</Router>
	), document.querySelector('[role=root]'));

