
var instance = Symbol('instance');
var getInstance = Symbol('getInstance');

var Singleton = {};

Singleton[instance] = null;

Singleton[getInstance] = function() {
	if(this[instance] === null) {
		this[instance] = Singleton;
	}
	return this[instance];
}

module.exports = Singleton[getInstance]();

