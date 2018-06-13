var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('styles', function stylesTask() {
	return gulp.src('sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.stream());;
});

gulp.task('serve', gulp.series('styles', function () {
	browserSync.init({
		server: "./"
	});
	browserSync.stream();

	gulp.watch('sass/**/*.scss', gulp.series('styles'));
	gulp.watch("html/*.html").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));