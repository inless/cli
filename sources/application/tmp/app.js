import http from 'http';
import process from 'process';
import app from './express.js';
import socketio from './socketio.js';
import webpack from './webpack.js';
import gulp from './gulp.js';

var config = require('../configs/server.json');

var mode = 'development';

let server = require('http').Server(app);
socketio(server);

// webpack();
gulp();

server.listen(config.mods[mode].port || 8080, config.mods[mode].host || 'localhost', () => {
	console.log(`server started on ${config.mods[mode].host||'localhost'}:${config.mods[mode].port||8080} in ${mode} mode`);
});
