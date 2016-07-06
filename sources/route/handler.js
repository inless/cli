import React from 'react';
import {Plugins, Components, logger, Route} from 'inless';

// let myPlugin = new Plugin('my-plugin');
// let myComponents = new Components('my-components');

export default class Page extends Route {
	render() {
		logger.debug(`Rendering ${this.displayName}`);
		return (
			<section>
				<section>
					<h2>{this.displayName}</h2>
				</section>
				<aside></aside>
			</section>
		);
	}
}

