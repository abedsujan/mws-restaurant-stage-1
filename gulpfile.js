var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('default', defaultTask);

gulp.task('styles', stylesTask);

function defaultTask(done) {
    // place code for your default task here

    console.log('AAAAAAAA');


 browserSync.init({
    server: "./"
});

    done();
}


function stylesTask() {
    return gulp.src('sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'));
}