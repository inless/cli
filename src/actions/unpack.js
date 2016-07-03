
import path from 'path';
import nfs from 'fs';
import {ncp} from 'ncp';

const _from = path.resolve(__dirname, '..', '..', 'sources');

export default function() {
	this.add('unpack', (resolve, reject, type, _to)=> {
		let _path = path.resolve(_from, type);
		nfs.exists(_path, (exists)=> {
			if(exists) {
				ncp(_path, _to, {clobber: false}, (err)=> {
					if(err) {
						reject(err.toString());
					} else {
						resolve(true);
					}
				});
			} else {
				reject(`wrong type: ${type}`);
			}
		});
	});
}
