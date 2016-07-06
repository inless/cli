
import React from 'react';

export default {
	render() {
		return (
			<main role="application">
				<header>
					<h1>inLess Application</h1>
					<pre>{JSON.stringify(this.getData(), true, '	')}</pre>
				</header>
				{this.props.children}
				<footer>
					<hr/>
					<section>
						All rights save &copy;
					</section>
				</footer>
			</main>
		);
	}
}
