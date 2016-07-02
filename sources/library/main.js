
import logger from 'logger';

export default {
	rand(min, max) {
		logger.info('call method');
		if(typeof max != 'number') {
			max = min;
			min = 0;
		}
		return min+Math.random()*max|0;
	}
}

