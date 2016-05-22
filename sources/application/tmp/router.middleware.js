import fs from 'fs';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Routes from './routes.js';
import {minify} from 'html-minifier';
import { RouterContext, Route, match } from 'react-router';
import {getParams} from 'react-router/lib/PatternUtils.js';
import express from 'express';

let layout = require('../layout/handler.js').default;
let middleware = require('../layout/middleware.js').default;
const template = fs.readFileSync('./layout/template.html').toString();

var router = express.Router();
var storage = {};

var render = function(layout, params, isminify = false) {
	var escapeHtml = function(text) {
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	}
	for(var _i in params) {
		var i = params[_i];
		layout = layout.split("%"+_i+"%").join(i);
		layout = layout.split("#"+_i+"#").join(escapeHtml(i));
	}
	return isminify ? minify(layout) : layout;
};

var mixins = [
	{
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
		getInitialState: function() {
			return storage[this.props.location.dataId]||{};
		}
	}
];

var routes = (
	<Route path="/" component={React.createClass((layout.mixins = mixins)&&layout)} middleware={middleware}>
		{Routes(mixins).map((route, i)=> <Route
			path={route.path}
			component={route.component}
			key={i}
			middleware={require(`../node_modules/inless_dependencies/${route.id}/middleware.js`).default}
		/>)}
	</Route>
);

router.use((req, res, next)=> {
	req.state = {};
	let dataId = (Math.random()*1e8|0).toString(32);
	storage[dataId] = {};
	setTimeout(()=> {
		if(storage[dataId]) {
			delete storage[dataId];
		}
	}, 60*1000);
	match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps)=> {
		if (error) {
			console.error(error.message);
			res.end('Server error');
			delete storage[dataId];
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search);
			delete storage[dataId];
		} else if (renderProps) {
			renderProps.location.dataId = dataId;
			var redirect = false;
			var title = 'inless Application';
			req.params = {};
			renderProps.routes.forEach((route)=> {
				req.params = Object.assign(req.params, getParams(route.path, renderProps.location.pathname));
			});
			var promises = renderProps.routes.map((route)=> {
				// TODO: fix this promise (race condition)
				return new Promise((resolve, reject)=> {
					var _res = {
						title,
						setState(key, value) {
							storage[dataId][key] = value;
						},
						setData(key, value) {
							storage[dataId][key] = value;
						},
						redirect(url) {
							redirect = url;
							title = this.title;
							resolve();
						},
						end(error) {
							title = this.title;
							error ? reject(error) : resolve();
						}
					}
					route.middleware(req, _res);
				});
			});
			Promise.all(promises).then(()=> {
				if(redirect) {
					res.redirect(302, redirect);
					delete storage[dataId];
				} else {
					var content = ReactDOM.renderToStaticMarkup/*.renderToString*/(
						<RouterContext {...renderProps} />
					);
					var xScript = `<script type="text/javascript" charset="utf-8">window[Symbol.for('preData')] = ${JSON.stringify(storage[dataId])};</script>
						<script type="text/javascript" charset="utf-8" src="${'/bundle.js'}"></script>`;
					var xStyle = `<link rel="stylesheetx" type="text/css" href="${'/bundle.css'}"></link>`;
					var html = render(template, {
						title: title,
						script: xScript,
						style: xStyle,
						'yield': content
					}, true);
					res.end(html);
					delete storage[dataId];
				}
			}).catch((error)=> {
				console.error(error);
				res.end('Server error');
			});
		} else {
			res.end('Not found');
			delete storage[dataId];
		}
	});
});

export default router;

