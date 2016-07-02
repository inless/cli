
var path = require('path');
var gulp = require('gulp');
var bower = require('gulp-bower');

const _to = process.cwd();

module.exports = function() {
	this.add('bower install', (resolve, reject)=> {
		bower({
			cmd: 'install',
			cwd: _to,
			directory: path.resolve(_to, 'node_modules'),
			verbosity: 2
		});
	});
}


