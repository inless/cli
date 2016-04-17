

const cli = require('cli');
const npm = require('npm');
const path = require('path');

const _from = path.resolve(__dirname, '..', '..', 'sources');
const _to = process.cwd();

var exec = require('child_process').exec


module.exports = function() {
	this.add('npm install', (resolve, reject)=> {
		npm.load((error)=> {
			var child = exec('npm install', {cwd: _to});
			child.stdout.on('data', function(data) {
				process.stdout.write(data);
			});
			child.on('close', function(code) {
				resolve(code);
			});
		});
	});
	this.add('npm init', (resolve, reject)=> {
		npm.load((error)=> {
			if(error) return reject(error.toString());
			npm.commands.init((error, data)=> {
				error ? reject(error.toString()) : resolve(data);
			});
		});
	});
	this.add('npm add', (resolve, reject, type, name, _path)=> {
		this.run('read json', [path.resolve(_to, 'package.json')]).then((data)=> {
			var local_name = `${type}-${((+new Date)/1e6%1e3|0).toString(32)+(Math.random()*1e4|0).toString(32)}`;
			if(!data['dependencies']) data['dependencies'] = {};
			for(var i in data['dependencies']) {
				if(data['dependencies'][i] == _path) {
					for( var j in data['inless']['dependencies'][type+'s']) {
						if(data['inless']['dependencies'][type+'s'][j] == i) {
							delete data['inless']['dependencies'][type+'s'][j];
						}
					}
					delete data['dependencies'][i];
				}
			}
			data['dependencies'][local_name] = _path;
			data['inless']['dependencies'][type+'s'][name] = local_name;
			this.run('write json', [path.resolve(_to, 'package.json'), data]).then((data)=> {
				this.run('npm install').then((data)=> {
					resolve(data);
				});
			});
		});
	});
};

