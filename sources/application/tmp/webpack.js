import path from 'path';
import process from 'process';
import webpack from 'webpack';

var compiler = webpack({
	entry: './tmp/clent-script.js',
	devtool: 'source-map',
	output: {
		path: path.resolve(process.cwd(), 'bundles'),
		filename: 'bundle.js',
		sourceMapFilename: '[file].map'
	},
	module: {
		loaders: [
			{
				test: /\.js$/i,
				loader: 'babel-loader'
			}
		]
	}
});


export default ()=> {
	compiler.run((err, stats)=> {
		console.log(stats.toString());
	});
}



