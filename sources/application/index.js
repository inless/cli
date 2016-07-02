var have = function(e,s) {return e.indexOf(s) != -1;}
require("babel-register")({
	ignore: function(e) {
		if(have(e, 'node_modules')) {
			if(have(e, 'inless_dependencies')) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
});
require('./tmp/app.js');