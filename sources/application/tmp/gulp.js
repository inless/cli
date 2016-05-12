// import webpack from 'webpack-stream';
import gulp from 'gulp';
import path from 'path';
import less from 'gulp-less';
import concat from'gulp-concat';
import clean from'gulp-clean';
import { rename, piperStyle, counter } from './gulp.less.js';


gulp.task('styles', ['less'], ()=> {
	return gulp.src('./static/*.css')
		.pipe(concat('build.css'))
		.pipe(gulp.dest('./static'));
});

gulp.task('clear', ['styles'], ()=> {
	return gulp.src('./static/tmp_*', {read: false})
		.pipe(clean({force: true}))
});

gulp.task('less', ()=> {
	return gulp.src(
			path.join(
				__dirname, 
				'..', 
				'node_modules', 
				'inless_dependencies', 
				'*', 
				'styles', 
				'index.less'
			))
		.pipe(piperStyle)
		.pipe(less())
		.pipe(rename)
		.pipe(gulp.dest('./static'))
});


gulp.task('default', ['clear'], ()=> {
	console.log(':)');
});

export default ()=> {
	gulp.start(['default']);
}
