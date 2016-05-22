

import md5 from './md5.js';

export default (url, is_url)=> {
	url = url.toLowerCase().replace(/\/$/gi, '');
	var branch = 'master', name, type = 'wrong';
	if((/\^git\:\/\//gi).test(url)) {
		type = 'https';
		url = url
			.replace(/\^git\:\/\//gi, 'https://')
			.replace(/\\.git(.*)$/gi, '')
			+'/archive/'+branch+'.zip';
	} else if((/^(local|file)\:\/\//gi).test(url)) {
		type = 'local';
		url = url
			.replace(/^(local|file)\:\/\//gi, '')
	}
	name = md5(url);
	return is_url ? url : name;
}