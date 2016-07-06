console.clear();


// loading server data;
let serverData = new Promise((resolve, reject)=> {
	setTimeout(()=> {
		resolve({a: Math.random()});
	}, 1000);
})

class inlessRoute extends React.Component {
	constructor(props) {
		super(props);
		this.__data = {};
		serverData.then(data=> {
			this.__data = data;this.forceUpdate();
			return data;
		});
		this.displayName = 'inless-route';
	}
	getData(key) {
		return this.__data[key];
	}
	render() {
		return (
			<h1>Page {this.displayName}</h1>
		);
	}
}


// user Route
class Route extends inlessRoute {
	constructor(props) {
		super(props);
		this.state = {a: 'world'};
	}
	render() {
		return (
			<h1>Hello {this.getData('a')||this.state.a}!</h1>
		);
	}
}

class inlessLoader extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'inless-loader';
		this.onLoad = new Promise((resolve, reject)=> {
			serverData.then(data=> {
				resolve(data);
			});
		});
	}
	getCurrentRoute() {
		return <Route/>;
	}
	render() {
		return (
			<div>Loading...</div>
		);
	}
}


// user Loader
class Loader extends inlessLoader {
	render() {
		return (
			<div>
				Loading...
				<br/>
				{this.getCurrentRoute()}
			</div>
		);
	}
}

class L extends Loader {
	constructor(props) {
		super(props);
		this.__loaded = false;
		this.onLoad.then((e)=> {
			this.__loaded = true;
			this.forceUpdate();
		});
	}
	render() {
		return this.__loaded ? this.getCurrentRoute() : super.render();
	}
}


// <Layout><L/></Layout>
ReactDOM.render(<L/>, document.getElementById('layout'));

