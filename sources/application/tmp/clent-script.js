
import SocketIO from 'socket.io-client';

var socket = SocketIO();

socket.on('connect', ()=> {
	console.log('connect', socket);
});
socket.on('event', (data)=> {
	console.log(data);
});
socket.on('disconnect', ()=> {
	console.log('disconnect');
});


console.log(':)');


