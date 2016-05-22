import gulp from 'gulp';
import path from 'path';
import less from 'gulp-less';
import concat from'gulp-concat';
import notify from'gulp-notify';
import clean from'gulp-clean';
import webpack from 'webpack-stream';
import { rename, piperStyle } from './gulp.less.js';


gulp.task('scripts', ()=> {
	return gulp.src(
			[
				// path.join(
				// 	__dirname, 
				// 	'..', 
				// 	'node_modules', 
				// 	'inless_dependencies', 
				// 	'*', 
				// 	'handler.js'
				// ),
				path.join(
					__dirname, 
					'client-script.js'
				)
			]
		)
		.pipe(webpack({
			devtool: 'source-map',
			output: {
				filename: 'bundle.js',
				sourceMapFilename: '[file].map'
			},
			module: {
				loaders: [
					{
						test: /\.json$/i,
						loader: 'json-loader'
					},
					{
						test: /\.js$/i,
						loader: 'babel-loader',
						exclude: false,
						query: {
							presets: ['es2015']
						}
					}
				]
			}
		}))
		.pipe(gulp.dest('./static'))
		.pipe(notify('Compiled.'));
});


gulp.task('styles', ['less'], ()=> {
	// return gulp.src('./static/*.css')
	// 	.pipe(concat('build.css'))
	// 	.pipe(gulp.dest('./static'));
});

gulp.task('clear', ['styles', 'scripts'], ()=> {
	return gulp.src('./static/tmp_*', {read: false})
		.pipe(clean({force: true}))
});

gulp.task('less', ()=> {
	return gulp.src(
			[
				path.join(
					__dirname, 
					'..', 
					'node_modules', 
					'inless_dependencies', 
					'*', 
					'style.less'
				)
			]
		)
		.pipe(piperStyle)
		.pipe(less())
		// .pipe(rename)
		.pipe(concat('build.css'))
		.pipe(gulp.dest('./static'))
});


gulp.task('default', ['clear'], ()=> {
	console.log(':)');
});

export default ()=> {
	gulp.start(['default']);
}
