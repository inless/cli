

const cli = require('cli');
const fs = require('fs-extra');
const nfs = require('fs');
const path = require('path');

const _from = path.resolve(__dirname, '..', '..', 'sources');
const _to = process.cwd();


module.exports = function() {
	this.add('unpack', (resolve, reject, type)=> {
		var Path = path.resolve(_from, type);
		nfs.exists(Path, (exists)=> {
			if(exists) {
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
			} else {
				reject(`wrong type: ${type}`);
			}
		})
	});
	this.add('clear', (resolve, reject)=> {
		fs.remove(path.resolve('./*'), (error, data)=> {
			error ? reject(error.toString()) : resolve(data);
		});
	});
};

