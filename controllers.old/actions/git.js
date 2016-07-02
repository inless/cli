

var git = require('nodegit');

module.exports = function() {
	this.add('git clone', (resolve, reject, path, addr)=> {
		git.Clone(addr.substr(addr.indexOf('+') + 1), path, {
			checkoutOpts: {
				depth: 1
			}
		}).then((data)=> {
			resolve(data);
		}).catch((error)=> {
			reject(error.toString());
		});
	});
}



