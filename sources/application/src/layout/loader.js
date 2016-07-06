import React from 'react';
import {pageLoader as Loader} from 'inless';

class Loader extends Loader {
	render() {
		return (
			<div>
				<div>
					Loading...
				</div>
			</div>
		);
	}
}
