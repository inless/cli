import path from 'path';
import fs from 'fs';

export default function() {
	this.add('read file', (resolve, reject, _path)=> {
		fs.readFile(path.resolve(_path), (err, data)=> {
			if(err) {
				console.log(err);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
	this.add('read json', (resolve, reject, _path)=> {
		try {
			fs.readFile(path.resolve(_path), (err, data)=> {
				if(err) {
					console.log(err);
					reject(err);
				} else {
					resolve(JSON.parse(data));
				}
			});
		} catch(err) {
			reject(err);
		}
	});
	this.add('write json', (resolve, reject, _path, data=null)=> {
		try {
			data = JSON.stringify(data, true, '	');
			fs.writeFile(path.resolve(_path), data, (err)=> {
				if(err) {
					console.log(err);
					reject(err);
				} else {
					resolve(data);
				}
			});
		} catch(err) {
			reject(err);
		}
	});
	this.add('write file', (resolve, reject, _path, data=null)=> {
		fs.writeFile(path.resolve(_path), data, (err)=> {
			if(err) {
				console.log(err);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

