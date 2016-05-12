import crypto from 'crypto';
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
	name = crypto.createHash('md5').update(url).digest('hex');
	return is_url ? url : name;
}