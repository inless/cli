
import pathToRegexp from 'path-to-regexp';
import React from 'react';
import { Route } from 'react-router';
import hashPath from './utils/hashPath.js';

const mainPkg = require('../package.json');
const routes = require('../configs/routes.json');


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
	constructor(id, path, mixins = []) {
		let source = require(`../node_modules/inless_dependencies/${id}/handler.js`).default;
		source.mixins = mixins;
		let Component = React.createClass(source);
		this.path = path;
		this.pkg = require(`../node_modules/inless_dependencies/${id}/package.json`);
		this.route = <Route path={path} component={Component} key={id} />;
	}
}

var app = new Element(mainPkg);

var mds = [];

class Middleware {
	constructor(id, path) {
		let source = require(`../node_modules/inless_dependencies/${id}/middleware.js`);
		this.path = path;
		this.md = source;
	}
}

for(let i in routes) {
	mds.push(new Middlewares(app.findDep(routes[i].name), routes[i].path));
}

export const exec = (url)=> {
	
}

