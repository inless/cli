import session from './session.js';
import sharedsession from 'express-socket.io-session';

export default (app)=> {
	var server = require('socket.io')(app);
	server.use(sharedsession(session, {
		autoSave:true
	})); 
	server.on('connection', (socket)=> {
		console.log('>>', socket.handshake.session);
		socket.on('2way', (data)=> {
			socket.emit('2way', {
				id: data.id,
				title: 'hello world',
				redirect: null,
				data: {
					hello: `world ${Math.random()}`
				}
			});
			console.log(data);
		});
		socket.on('close', ()=> {
			console.log('close');
		});
	});
	return server;
};