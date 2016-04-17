

const cli = require('cli');
const npm = require('npm');
const path = require('path');

const _from = path.resolve(__dirname, '..', '..', 'sources');
const _to = process.cwd();

module.exports = function() {
	this.add('npm install', (resolve, reject)=> {
		npm.load((error)=> {
			if(error) return reject(error.toString());
			npm.commands.install((error, data)=> {
				error ? reject(error.toString()) : resolve(data);
			});
			// npm.registry.log.on('log', (message)=> {
				// process.stdout.write(`${message.message}\n`);
			// });
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
	this.add('npm add', (resolve, reject)=> {
		this.run('read json', [path.resolve(_to, 'package.json')]).then((data)=> {
			console.log(data);
			resolve(data);
		});
	});
};

