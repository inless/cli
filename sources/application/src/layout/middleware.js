export default function(req, res) {
	res.setData({
		session_id: req.session.id,
		session_status: req.session.status,
		url_params: req.params,
		url_query: req.query
	});
	res.next();
}