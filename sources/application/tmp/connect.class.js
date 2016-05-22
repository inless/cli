
import SocketIO from 'socket.io-client';
import EventEmitter from 'events';

var socket = Symbol('socket');
var emit = Symbol('emit');
var ids = Symbol('ids');


class Connect extends EventEmitter {
	constructor() {
		super();
		this[socket] = SocketIO();
		this[ids] = {};
		this[socket].on('connect', ()=> {
			console.log('connect');
		});
		this[socket].on('disconnect', ()=> {
			console.log('disconnect');
		});
		this[socket].on('2way', (data)=> {
			if(this[ids][data.id]) {
				this[ids][data.id](data);
				delete this[ids][data.id];
			}
		});
		this[socket].on('emit', (data)=> {
			super.emit(data.action, data.data);
		});
	}
	twoWay(action, data) {
		return new Promise((resolve, reject)=> {
			var id = (new Date%1e8).toString(32)+(Math.random()*1e5|0).toString(32);
			this[socket].emit('2way', {
				id,
				action,
				data
			});
			this[ids][id] = (data)=> {
				resolve(data);
			};
		});
	}
	emit(action, data) {
		this[socket].emit('emit', {
			action,
			data
		});
	}
}


export default Connect;


