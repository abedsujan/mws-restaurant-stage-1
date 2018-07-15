var distDir = './dist';

var gulp = require('gulp');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var eslint = require('gulp-eslint');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var fs = require('fs');
var gzip = require('gulp-gzip');
var webp = require('gulp-webp');

if (fs.existsSync(distDir)) {
	var middleware = require('connect-gzip-static')(distDir);
}

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

function clean_scripts() {
	return gulp
		.src([distDir], {
			read: false
		})
		.pipe(clean({
			force: true
		}));
}

function build_html() {
	return gulp
		.src('./**/*.html')
		.pipe(gulp.dest(distDir));
}

function build_styles() {
	return gulp
		.src('sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());;
}

function build_scripts() {
	return gulp
		.src('js/**/*.js')
		.pipe(gulp.dest('dist/js'));

	// return gulp.src('js/**/*.js')
	// .pipe(babel())
	// .pipe(concat('all.js'))
	// .pipe(uglify())
	// .pipe(sourcemaps.write())
	// .pipe(gulp.dest('dist/js'));
}

function build_images() {
	return gulp
		.src('img/**/*')
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest('dist/img'));
}

function browsersync_reload(done) {
	browserSync.reload();
	done();
}

function watch_scripts() {
	gulp.watch('sass/**/*.scss', gulp.series('build-styles', 'browsersync-reload'));
	gulp.watch('js/*.js', gulp.series('build-scripts', 'browsersync-reload'));
	gulp.watch('/*.html', gulp.series('build-html', 'browsersync-reload'));
	gulp.watch(['sw.js', 'manifest.json'], gulp.series('copy-static', 'browsersync-reload'));
}

function copy_static_files() {
	return gulp.src(['sw.js', './manifest.json'])
		.pipe(gulp.dest(distDir));
}

function compress_html() {
	return gulp.src(distDir + '/*.html')
		.pipe(gzip())
		.pipe(gulp.dest(distDir));
}

function clean_unused_html() {
	return gulp
		.src([distDir + '/*.html'], {
			read: false
		})
		.pipe(clean());
}

function compress_css() {
	return gulp.src(distDir + '/css/*.css')
		.pipe(gzip())
		.pipe(gulp.dest(distDir + '/css'));
}

function clean_unused_css() {
	return gulp
		.src([distDir + '/css/*.css'], {
			read: false
		})
		.pipe(clean());
}

function ompress_js() {
	return gulp.src(distDir + '/js/*.js')
		.pipe(gzip())
		.pipe(gulp.dest(distDir + '/js'));
}

function clean_unused_js() {
	return gulp
		.src([distDir + '/js/*.js'], {
			read: false
		})
		.pipe(clean());
}


gulp.task('clean', clean_scripts);
gulp.task('build-html', build_html);
gulp.task('build-styles', build_styles);
gulp.task('build-scripts', build_scripts);
gulp.task('build-images', build_images);
gulp.task('watch', watch_scripts);
gulp.task('browsersync-reload', browsersync_reload);
gulp.task('copy-static', copy_static_files);

gulp.task('compress-html', compress_html);
gulp.task('compress-css', compress_css);
gulp.task('compress-js', ompress_js);
gulp.task('clean-unused-html', clean_unused_html);
gulp.task('clean-unused-css', clean_unused_css);
gulp.task('clean-unused-js', clean_unused_js);

gulp.task('build', gulp.series([
	'clean',
	'build-html',
	'build-styles',
	'build-scripts',
	'build-images',
	'copy-static'
]));

gulp.task('compress', gulp.series([
	'compress-html',
	'compress-css',
	'compress-js',
	'clean-unused-html',
	'clean-unused-css',
	'clean-unused-js'
]));

gulp.task('serve-dev', gulp.series('build', function () {
	browserSync.init({
		server: "./dist"
	});
	browserSync.stream();
}));


gulp.task('serve', gulp.series('build', function () {
	browserSync.init({
		server: {
			baseDir: distDir,
			index: 'index.html',
			files: [
				distDir + '/*.html.gz',
				distDir + '/css/*.css.gz',
				distDir + '/js/*.js.gz'
			]
		}
	}, function (err, bs) {
		bs.addMiddleware('*', middleware, {
			override: true
		});
	});
}));



gulp.task('default', gulp.series('build', 'serve-dev', 'watch'));