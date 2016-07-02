
import logger from 'logger';

var superPlugin;
var publicConfigs;
var privateConfigs;

export default {
	init() {
		logger.info('Plugin');
		superPlugin = this.inless.getPlugin('superPlugin');
		publicConfigs = this.inless.getPublicConfigs();
		privateConfigs = this.inless.getPrivateConfigs();
	}
}

