
import CLI from './classes/cli.class.js';
import UI from './classes/ui.class.js';

const configs = require('../configs/cli-stack.json');

let ui = new UI();
let cli = new CLI(configs);

let handler = (command = null)=> {
	switch(command) {
		case 'init': {
			console.log('new:)');
		} break;
		default: {
			cli.getCommand().then(handler).catch(error=>console.log(`${error}.`));
		}
	}
}

handler();

