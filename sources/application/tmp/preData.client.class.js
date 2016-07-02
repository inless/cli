
import EventEmitter from 'events';

var oldLocation = Symbol('oldLocation');
var defaultTitle = '';

var isLoaded = false;
var baseData = {};

class PreData extends EventEmitter {
	constructor(connect) {
		super();
		this.connect = connect;
		if(window[Symbol.for('preData')]) {
			baseData = window[Symbol.for('preData')];
		}
	}
	load(url, force = false) {
		if(force || this[oldLocation] != url) {
			this[oldLocation] = url;
			this.connect.twoWay('preData', { url }).then((data)=> {
				document.title = data.title||defaultTitle;
				if(data.redirect) {
					alert(`redirect: ${data.redirect}`);
				} else {
					super.emit('data', data.data);
				}
			});
		}
	}
	base(url) {
		let data = baseData;
		if(url && !isLoaded) {
			isLoaded = true;
			baseData = {};
		} else {
			if(isLoaded && url) {
				this.load(url, true);
			}
		}
		return data;
	}
}


export default PreData;

