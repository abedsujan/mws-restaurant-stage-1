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
var inject = require('gulp-inject');
var del = require('del');

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
	return del(['dist/**', './js/bundle.js'], {
		force: true
	});
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

	const js_files = [
		'./js/idb.js',
		'./js/idb_helper.js',
		'./js/dbhelper.js',
		'./js/init.js',
		'./js/restaurant_db_helper.js',
		'./js/review_db_helper.js',
		'./js/header.js',
		'./js/home_html_fragments.js',
		'./js/info_html_fragments.js',
		'./js/main.js',
		'./js/restaurant_info.js'
	];

	return gulp
		.src(js_files)
		.pipe(babel())
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest('./js'))
		.pipe(gulp.dest('./dist/js'));

	// return gulp.src(['js/dbhelper.js', 'js/idb.js', 'js/home_html_fragments.js', 'js/main.js'])
	// .pipe(concat('bundle_main.js'))
	// .pipe(gulp.dest('./js'))
	// .pipe(gulp.dest('dist/js'))
	// .pipe(gulp.src(['js/dbhelper.js', 'js/idb.js', 'js/info_html_fragments.js', 'js/restaurant_info.js']))
	// .pipe(concat('bundle_restaurant_info.js'))
	// .pipe(gulp.dest('./js'))
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
	gulp.watch('./js/*.js', gulp.series('build-scripts', 'browsersync-reload'));
	gulp.watch('/*.html', gulp.series('build-html', 'browsersync-reload'));
	gulp.watch(['sw.js', 'manifest.json'], gulp.series('copy-static', 'browsersync-reload'));
}

function copy_static_files() {
	return gulp.src(['sw.js', './manifest.json'])
		.pipe(gulp.dest(distDir));
}

function js_minify() {
	return gulp.src(distDir + '/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest(distDir + '/js'));
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

function compress_js() {
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


gulp.task('index', function () {
	var target = gulp.src('./index.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(['./js/bundle.js'], {
		read: false
	});

	return target.pipe(inject(sources))
		.pipe(gulp.dest('./dist'));

});

gulp.task('restaurant', function () {
	var target = gulp.src('./restaurant.html');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src(['./js/bundle.js'], {
		read: false
	});

	return target.pipe(inject(sources))
		.pipe(gulp.dest('./dist'));

});

gulp.task('clean', clean_scripts);
gulp.task('build-html', build_html);
gulp.task('build-styles', build_styles);
gulp.task('build-scripts', build_scripts);
gulp.task('js-minify', js_minify);
gulp.task('build-images', build_images);
gulp.task('watch', watch_scripts);
gulp.task('browsersync-reload', browsersync_reload);
gulp.task('copy-static', copy_static_files);

gulp.task('compress-html', compress_html);
gulp.task('compress-css', compress_css);
gulp.task('compress-js', compress_js);
gulp.task('clean-unused-html', clean_unused_html);
gulp.task('clean-unused-css', clean_unused_css);
gulp.task('clean-unused-js', clean_unused_js);


gulp.task('build', gulp.series([
	'clean',
	'build-html',
	'build-styles',
	'build-scripts',
	'build-images',
	'copy-static',
	'index',
	'restaurant'
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


gulp.task('serve', gulp.series('build', 'compress', function () {
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