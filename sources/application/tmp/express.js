import path from 'path';
import process from 'process';
import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from './session.js';
import router from './router.middleware.js';

var servConfig = require('../configs/server.json');

var app = express();

app.disable('x-powered-by');

servConfig.compression===false?0:
	app.use(compression({
		level: servConfig.compression || 9
	}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(multer({
	storage: path.resolve(servConfig.tmp || './tmp')
}).any());

app.use(
	express.static(
		path.resolve('./../static')
	)
);

app.use(cookieParser());

app.use(session);

app.use((req, res, next) => {
	if (!req.session) {
		req.session = {};
	}
	if (!req.session.accessLevel) {
		req.session.accessLevel = "any";
	}
	next();
});

// TODO: logger, configs, tmp path, static path, style, rpc, api, router


// app.use(require('./style.js'));
// app.use(require('./express.rpc.js'));
// app.use(require('./express.api.js'));
// app.use(require('./router.js'));

app.use(express.static('static'));
app.use(express.static('bundles'));


app.use(router);

app.use((req, res)=> {
	res.sendStatus(404).end('Not Found');
});


// app.use((req, res, next) => {
// 	res.sendStatus(400);
// 	res.json('Bad request');
// });

export default app;
