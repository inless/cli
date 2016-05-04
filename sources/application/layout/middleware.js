export default function(req, res) {
	res.setData('session.status', req.session.status);
	res.setData('session.id', req.session.id);
	res.setData('url.params', req.params);
	res.setData('url.query', req.query);
	res.next();
}