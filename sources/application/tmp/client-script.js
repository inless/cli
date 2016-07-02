

import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes.js';
import { Router, Route, browserHistory } from 'react-router';

import Connect from './connect.class.js';
import PreData from './preData.client.class.js';

var connect = new Connect();
var preData = new PreData(connect);

var mount = Symbol('mount');
var inited = Symbol('inited');

let layout = require('../layout/handler.js').default;

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
			let url = window.location.href;
			if(!this[inited]) {
				this[inited] = true;
				preData.on('data', (data)=> {
					if(this[mount]) {
						this.setState(data);
					}
				});
				// return preData.base(url);
			}
			return preData.base(url);
		},
		componentDidUpdate() {
			let url = window.location.href;
			// `${this.props.location.pathname}${this.props.location.search}${this.props.location.hash}`
			preData.load(url);
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

layout.mixins = mixinsL;

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


