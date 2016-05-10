import session from './session.js';
import sharedsession from 'express-socket.io-session';

export default (app)=> {
	var server = require('socket.io')(app);
	server.use(sharedsession(session, {
		autoSave:true
	})); 
	server.on('connection', (socket)=> {
		console.log('>>', socket.handshake.session);
		socket.emit('event', {a:222});
		socket.on('message', (data)=> {
			console.log(data);
		});
		socket.on('close', ()=> {
			console.log('close');
		});
	});
	return server;
};