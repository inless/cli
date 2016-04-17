

const cli = require('cli');
const fs = require('fs-extra');
const nfs = require('fs');
const path = require('path');

const _from = path.resolve(__dirname, '..', '..', 'sources');
const _to = process.cwd();


module.exports = function() {
	this.add('unpack', (resolve, reject, type)=> {
		if(!nfs.existsSync(path.resolve(_from, type))) {
			reject(`wrong type: ${type}`);
		} else {
			fs.copy(
				path.resolve(_from, type), 
				path.resolve(_to), 
				{
					clobber: false
				},
				(err)=> {
					if(err) {
						reject(err.toString());
					} else {
						resolve('success!');
					}
				}
			);
		}
	});
	this.add('read json', (resolve, reject, name)=> {
		fs.readJson(name, (error, data)=> {
			error ? reject(error.toString()) : resolve(data);
		});
	});
	this.add('write json', (resolve, reject, name, data)=> {
		fs.outputJson(name, data, (error)=> {
			error ? reject(error.toString()) : resolve(data);
		});
	});
};

