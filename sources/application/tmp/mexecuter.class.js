import { match } from 'react-router';
import { getParams } from 'react-router/lib/PatternUtils.js';

class MExecuter {
	constructor(routes) {
		this.routes = routes;
	}
	test(url) {
		return new Promise((resolve, reject)=> {
			match({ routes: this.routes, location: url }, (error, redirectLocation, renderProps)=> {
				if(error) {
					console.error(error);
					reject(error);
				} else if(redirectLocation) {
					resolve( { redirect: redirectLocation } );
				} else if(renderProps) {
					resolve(renderProps);
				} else {
					reject(404);
				}
			});
		});
	}
	middlewares(req, renderProps) {
		return new Promise((resolve, reject)=> {
			let store = {};
			let redirect = null;
			let title = 'inless Application';
			req.params = {};
			renderProps.routes.forEach((route)=> {
				req.params = Object.assign(req.params, getParams(route.path, renderProps.location.pathname));
			});
			let promises = renderProps.routes.map((route)=> {
				// TODO: fix this promise (race condition)
				return new Promise((resolve, reject)=> {
					let _res = {
						title,
						setState(key, value) {
							store[key] = value;
						},
						setData(key, value) {
							store[key] = value;
						},
						redirect(url) {
							redirect = url;
						},
						end(error) {
							title = this.title;
							error ? reject(error) : resolve();
						}
					}
					route.middleware(req, _res);
				});
			});
			Promise.all(promises).then(()=> {
				if(redirect) {
					resolve({redirect});
				} else {
					resolve({store, title});
				}
			}).catch((error)=> {
				console.error(error);
				reject(error);
			});
		});
	}
}

export default MExecuter;

