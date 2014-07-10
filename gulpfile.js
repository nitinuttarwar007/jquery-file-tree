var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
    
gulp.task('coffee', function () {
    return gulp.src('./src/*.coffee')
        .pipe(coffee({bare : true })).on('error', gutil.log)
        .pipe(gulp.dest('./'))
        .pipe(uglify())
        .pipe(rename({suffix : '.min'}))
        .pipe(gulp.dest('./')) 
});