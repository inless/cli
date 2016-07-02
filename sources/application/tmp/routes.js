
import hashPath from './utils/hashPath.js';
import React from 'react';
import { Route } from 'react-router';

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
		this.component = React.createClass(source);
		this.id = id;
		this.path = path;
		this.pkg = require(`../node_modules/inless_dependencies/${id}/package.json`);
		// this.route = <Route path={path} component={Component} key={id} middleware={middleware} />;
	}
}

var app = new Element(mainPkg);

export default (mixins = [])=> {
	var _routes = [];
	for(let i in routes) {
		_routes.push(new Handler(app.findDep(routes[i].name), routes[i].path, mixins));
	}
	return _routes;
}





