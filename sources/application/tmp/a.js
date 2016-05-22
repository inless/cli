import fs from 'fs';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Routes from './routes.js';
import {minify} from 'html-minifier';
import { Router, RouterContext, Route, hashHistory, match } from 'react-router';
import { Route } from 'react-router';
import hashPath from './utils/hashPath.js';

const mainPkg = require('../package.json');
const routes = require('../configs/routes.json');


const template = fs.readFileSync('./layout/template.html').toString();


class Element {
	constructor(pkg) {
		this.deps = [];
		for(let i in pkg.inless.dependencies) {
			this.deps.push({
				id: hashPath(i),
				path: i,
				aliases: typeof pkg.inless.dependencies[i] == 'string' ? [ pkg.inless.dependencies[i] ] : pkg.inless.dependencies[i]
			});
		}
	}
	findDep(name) {
		let res = this.deps.filter(e=> e.aliases.indexOf(name) != -1);
		return res.length ? res[0].id : null;
	}
}

class Handler {
	constructor(id, path, mixins = [], Layout) {
		let source = require(`../node_modules/inless_dependencies/${id}/handler.js`).default;
		source.mixins = mixins;
		let Component = React.createClass(source);
		this.path = path;
		this.pkg = require(`../node_modules/inless_dependencies/${id}/package.json`);
		this.route = <Route path={path} component={Component} key={id} />;
	}
}

var app = new Element(mainPkg);

var getRoutes = (mixins = [], Layout)=> {
	var _routes = [];
	for(let i in routes) {
		_routes.push(new Handler(app.findDep(routes[i].name), routes[i].path, mixins, Layout));
	}
	return _routes.map(e=> e.route);
}






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
			return {};
		}
	}
];



let layout = require('../layout/handler.js').default;

layout.mixins = mixins;


export default (req, res, next)=> {
	var routes = <Layout>{getRoutes(mixins, Layout)}</Layout>;
	match({ routes: routes, location: req.url }, (error, redirectLocation, renderProps)=> {
		console.log('renderProps', renderProps);
		if (error) {
			console.error(error.message);
			res.end(500, 'Server error');
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			var content = ReactDOM.renderToStaticMarkup/*.renderToString*/(
				<RouterContext {...renderProps}/>
			);
			var xScript = `<script type="text/javascript" charset="utf-8">var window[Symbol.for('preData')] = ${JSON.stringify({a:222})};</script>
				<script type="text/xjavascript" charset="utf-8" src="${'/bundle.js'}"></script>`;
			var xStyle = `<link rel="stylesheetx" type="text/css" href="${'/bundle.css'}"></link>`;
			var html = render(template, {
				title: 'lol',
				script: xScript,
				style: xStyle,
				'yield': content
			}, true);
			res.end(html);
		} else {
			res.end('404');
		}
	});
}






