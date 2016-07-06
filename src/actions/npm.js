import {exec} from 'child_process';

export default function() {
	this.add('npm install', (resolve, reject, _path)=> {
		let child = exec(`npm install .`, {
			cwd: _path
		}, (error, stdout, stderr)=> {
			if (error !== null) {
				reject(error.toString());
			} else {
				resolve(true);
			}
		});
	});
}

