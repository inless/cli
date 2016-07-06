import React, {Component} from 'react';
import {Plugins, Components, logger} from 'inless';

// let myPlugin = new Plugin('my-plugin');
// let myComponents = new Components('my-components');

export default class Route extends Component {
	render() {
		logger.debug(`Rendering ${this.displayName}`);
		return (
			<section>
				<sectipn>
					<h2>{this.displayName}</h2>
				</section>
				<aside></aside>
			</section>
		);
	}
}

