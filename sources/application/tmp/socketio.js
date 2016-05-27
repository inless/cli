import session from './session.js';
import sharedsession from 'express-socket.io-session';

var singletone = require('./singletone.js');

export default (app)=> {
	var server = require('socket.io')(app);
	server.use(sharedsession(session, {
		autoSave:true
	}));
	server.on('connection', (socket)=> {
		console.log('>>', socket.handshake.session);
		socket.on('2way', (data)=> {
			// console.log(data);
			let mwr = singletone['ME'];
			let answer = (error, title, store, redirect)=> {
				socket.emit('2way', {
					id: data.id,
					title: title,
					redirect: redirect,
					data: store
				});
			}
			switch(data.action) {
				case 'preData':
					let renderProps;
					let url = data.data.url;
					let req = {
						url,
						session: socket.handshake.session
					}
					mwr.test(url).then((data)=> {
						renderProps = data;
						return mwr.middlewares(req, renderProps);
					}).then((data)=> {
						answer(null, data.title, data.store, data.redirect);
					}).catch((error)=> {
						if(typeof error == 'number') {
							switch(error) {
								case 404:
									answer('Not Found', 'Not Found', {}, null);
								break;
							}
						} else {
							console.error(error);
							answer('Server error', 'Server error', {}, null);
						}
					});
				break;
			}
		});
		socket.on('close', ()=> {
			console.log('close');
		});
	});
	return server;
};