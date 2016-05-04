
import React from 'react';
import components from 'components';

var MainMenu = components('MainMenu');

export default {
	render() {
		let istatus = this.state?this.state['session.status']:8;
		return (
			<div>
				<header>
					<h1>Unlock Content</h1>
					<MainMenu level={istatus} />
					<pre>{JSON.stringify(this.state)}</pre>
				</header>
				<main>
					{this.props.children}
				</main>
				<footer>
					<hr/>
					<div>
						All rights save &copy;
					</div>
				</footer>
			</div>
		);
	}
}
