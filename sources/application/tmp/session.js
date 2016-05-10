import cookieSession from 'cookie-session';
var servConfig = require('../configs/server.json');
export default cookieSession({
	httpOnly: true,
	signed: true,
	name: servConfig.session.name,
	keys: [servConfig.session.secret]
});