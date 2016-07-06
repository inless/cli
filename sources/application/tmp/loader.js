console.clear();

// loading server data;
let serverData = new Promise((resolve, reject)=> {
	setTimeout(()=> {
		resolve({a: Math.random()});
	}, 1000);
});

class inlessRoute extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'inless-route';
		this.componentClassName = this.displayName;
		this.loader = this.props.children;
		this.__data = {};
		this.onLoad = new Promise((resolve, reject)=> {
			serverData.then(data=> {
				this.__data = data;
				resolve(data);
			});
		});
		this.onLoad.then((data)=> {
			this.loader = null;
			this.forceUpdate();
			return data;
		});
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
			<div className={this.componentClassName}>
				{this.loader}
				<h1>Hello {this.getData('a')||this.state.a}!</h1>
			</div>
		);
	}
}

class inlessLoader extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'inless-loader';
		this.componentClassName = this.displayName;
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
			<div className={this.componentClassName}>
				Loading...
			</div>
		);
	}
}



// <Layout><Route><Loader/></Route></Layout>
ReactDOM.render(<Route><Loader/></Route>, document.getElementById('layout'));

