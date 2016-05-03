

// const cli = require('cli');
// const npm = require('npm');
const request = require('request');
const unzip = require('unzip');
const fs = require('fs-extra');
const fss = require('fs');
const path = require('path');
const crypto = require('crypto');
const ncp = require('ncp').ncp;


const _from = path.resolve(__dirname, '..', '..', 'sources');
const _to = process.cwd();

var exec = require('child_process').exec;

var normalize = function(url) {
	url = url.toLowerCase().replace(/\/$/gi, '');
	var branch = 'master', name = crypto.createHash('md5').update(url).digest('hex'), type = 'wrong';
	if(new RegExp('^git\:\/\/', 'gi').test(url)) {
		type = 'https';
		url = url
			.replace(/\^git\:\/\//gi, 'https://')
			.replace(/\\.git(.*)$/gi, '')
			+'/archive/'+branch+'.zip';
	} else if((/^(local|file)\:\/\//gi).test(url)) {
		type = 'local';
		url = url
			.replace(/^(local|file)\:\/\//gi, '')
	}
	return {
		name: name, 
		type: type, 
		url: url
	};
}

var Stack = (function(){
	var Class = function(action) {
		this._stack = [];
		this._action = action;
		this.version = '1.0.0';
	}
	Class.prototype = {
		add(url) {
			this._stack.push(url);
		},
		install() {
			var self = this;
			var install = function(url) {
				return new Promise(function(resolve, reject) {
					var address = normalize(url);
					var depPath = path.resolve(_to, 'node_modules/inless_dependencies', address.name);
					var tmpPath = path.resolve(_to, 'tmp', address.name);
					var readPackage = function() {
						return new Promise((resolve, reject)=> {
							fs.readJson(path.resolve(depPath, 'package.json'), (err, data)=> {
								if(err) {
									reject(err);
								} else {
									if(data['inless'] && data['inless']['version'] == self.version) {
										var deps = [];
										for(var i in data['inless']['dependencies']) {
											if(!fss.existsSync(
												path.resolve(
													_to,
													'node_modules/inless_dependencies',
													normalize(i).name
												)
											)) {
												deps.push(i);
											}
										}
										resolve(deps);
									} else {
										reject('wrong package in '+address.name);
									}
								}
							});
						});
					}
					var afterUnpack = function() {
						// normalize folder inside archive
						return new Promise(function(resolve, reject) {
							fss.readdir(depPath, function(err, data) {
								if(!err && data[0]) {
									ncp(path.resolve(depPath, data[0]), depPath, function(err) {
										fs.remove(path.resolve(depPath, data[0]), function(err) {
											if (err) {
												reject(err);
											} else {
												resolve(address.name);
											}
										});
									});
								} else {
									reject(err);
								}
							});
						});
					}
					var finish = function() {
						readPackage()
							.then((data)=> {
								return Promise.all(data.map((e)=> install(e)));
							})
							.then((data)=> {
								resolve(data);
							})
							.catch((err)=> {
								reject(err);
							});
					}
					if(!fss.existsSync(
						path.resolve(
							_to,
							'node_modules/inless_dependencies',
							address.name
						)
					)) {
						switch(address.type) {
							case 'http':
							case 'https': {
								request(address.url).pipe(fs.createWriteStream(tmpPath))
									.on('close', function() {
										fss.createReadStream(tmpPath)
											.pipe(unzip.Extract({ path: depPath }))
											.on('close', function() {
												fs.remove(tmpPath, function(err) {
													if (err) {
														reject(err);
													} else {
														afterUnpack()
															.then((data)=> {
																finish();
															});
													}
												});
											});
									}).on('error', function() {
										reject(error);
									});
							} break;
							case 'local': {
								ncp(path.resolve(address.url), depPath, function(err) {
									if (err) {
										reject(err);
									} else {
										finish()
									}
								});
							} break;
							default: { 
								reject('wrong path: '+url);
							}
						}
					} else {
						finish();
					}
				});
			}
			return Promise.all(
				this._stack.map((url)=> {
					return install(url);
				})
			);
		}
	}
	return Class;
})()



module.exports = function() {
	this.add('get package', (resolve, reject)=> {
		var Path = path.resolve(_to, 'package.json');
		fs.exists(Path, function(exists) {
			if(exists) {
				fs.readJson(Path, function (err, packageObj) {
					if(err) {
						reject('error');
					} else {
						resolve(packageObj);
					}
				});
			} else {
				reject('not found file: ' + Path);
			}
		});
	});
	this.add('set package', (resolve, reject, data)=> {
		var Path = path.resolve(_to, 'package.json');
		fs.exists(Path, function(exists) {
			fs.writeJson(Path, data, function (err) {
				if(err) {
					reject('error');
				} else {
					resolve(data);
				}
			});
		});
	});
	this.add('npm install', (resolve, reject, Path)=> {
		Path = Path||_to;
		var child = exec('npm install', {cwd: Path});
		child.stdout.on('data', function(data) {
			process.stdout.write(data);
		});
		child.on('close', function(code) {
			resolve(code);
		});
	});
	this.add('install module', function(resolve, reject, url, name) {
		var address = normalize(url);
		var install = ()=> {
			var stack = new Stack(this);
			stack.add(url);
			stack.install()
				.then((data)=> {
					resolve(data);
				})
				.catch((err)=> {
					reject(err);
				});
		}
		if(name) {
			this.run('get package')
			.then((data)=> {
				if(data['inless'] && data['inless']['dependencies']) {
					if(data['inless']['dependencies'][address.url]) {
						data['inless']['dependencies'][address.url].push(name);
					} else {
						data['inless']['dependencies'][address.url] = [name];
					}
					return this.run('set package', [data]);
				} else {
					reject('wrong package.json');
				}
			})
			.then((data)=> {
				install();
			});
		} else {
			install();
		}
	});
	this.add('reinstall dependencies', function(resolve, reject) {
		var inless_dependencies = path.resolve(_to, 'node_modules/inless_dependencies');
		fs.remove(inless_dependencies, (err)=> {
			if (err) return reject(err);
			fs.mkdirs(inless_dependencies, (err)=> {
				if (err) return reject(err);
				this.run('get package')
					.then((data)=> {
						if(data['inless'] && data['inless']['dependencies']) {
							var stack = new Stack(this);
							for(var i in data['inless']['dependencies']) {
								stack.add(i);
							}
							stack.install()
								.then((data)=> {
									resolve(data);
								})
								.catch((err)=> {
									reject(err);
								});
						} else {
							reject('wrong package.json');
						}
				});
			});
		});
	});
};

