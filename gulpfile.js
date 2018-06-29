var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

gulp.task('styles', () => {
	return gulp.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());;
});

gulp.task('copy-js', function () {
	return gulp.src('js/**/*.js')
		.pipe(gulp.dest('dist/js'));
});


gulp.task('scripts', function () {
	return gulp.src('js/**/*.js')
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});


gulp.task('scripts-dist', function () {
	return gulp.src('js/**/*.js')
		.pipe(babel())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

function copy_html() {
	return gulp.src('./*.html')
		.pipe(gulp.dest('./dist'));
}

gulp.task('copy-html', copy_html);

gulp.task('copy-image', function () {
	return gulp.src('img/*')
		.pipe(gulp.dest('dist/img'));
});



gulp.task('lint', () => {
	// ESLint ignores files with "node_modules" paths.
	// So, it's best to have gulp ignore the directory as well.
	// Also, Be sure to return the stream from the task;
	// Otherwise, the task may end before the stream has finished.
	return gulp.src(['**/*.js', '!node_modules/**'])
		// eslint() attaches the lint output to the "eslint" property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});

gulp.task('serve', gulp.series('styles', 'copy-js', 'copy-html', function () {
	browserSync.init({
		server: "./dist"
	});
	browserSync.stream();

	gulp.watch('sass/**/*.scss', gulp.series('styles'));
	gulp.watch('js/**/*.js', gulp.series('lint'));
	gulp.watch('index.html', gulp.series('copy-html'));
	gulp.watch("html/*.html").on('change', browserSync.reload);
}));



gulp.task('tests', () => {

	gulp.src(['tests/spec/extraSpec.js'])
		.pipe(jasmine({
			integration: true,
			vendor: 'js/**/*.js'
		}))

});


gulp.task('dist', gulp.series([
	'copy-html',
	'copy-image',
	'styles',
	'lint',
	'scripts-dist'
]));


gulp.task('default', gulp.series('serve'));
