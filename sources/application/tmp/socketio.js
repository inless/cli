import Url from 'url';
import session from './session.js';
import sharedsession from 'express-socket.io-session';

var singletone = require('./singletone.js');

export default (app)=> {
	var server = require('socket.io')(app);
	server.use(sharedsession(session, {
		autoSave:true
	}));
	server.on('connection', (socket)=> {
		socket.on('2way', (data)=> {
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
					let date = new Date;
					console.log(`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] <${socket.handshake.address} ${socket.handshake.session.AccID||''}> ${data.data.url}`);
					let renderProps;
					let url = data.data.url;
					let urlData = Url.parse(url);
					let shortUrl = `${urlData.path}${urlData.search||''}${urlData.hash||''}`;
					mwr.test(shortUrl).then((data)=> {
						renderProps = data;
						let req = {
							hostname: urlData.hostname,
							ip: socket.handshake.address,
							ips: [ socket.handshake.address ],
							method: socket.request.method,
							originalUrl: url,
							params: {},
							path: urlData.path,
							protocol: urlData.protocol,
							query: urlData.query||{},
							secure: socket.handshake.secure,
							subdomains: [ urlData.host ],
							xhr: true,
							url: shortUrl,
							body: {},
							files: {},
							session: Object.assign({}, socket.handshake.session)
						};
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