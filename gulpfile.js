var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename')
    less = require('gulp-less'),
    minify = require('gulp-minify-css');

    
gulp.task('coffee', function () {
    return gulp.src('./src/coffee/*.coffee')
        .pipe(coffee({bare : true })).on('error', gutil.log)
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify())
        .pipe(rename({suffix : '.min'}))
        .pipe(gulp.dest('./dist/js/')) 
});

gulp.task('less', function () {
    return gulp.src('./src/less/*.less')
        .pipe(less()).on('error', gutil.log)
        .pipe(gulp.dest('./dist/css/'))
        .pipe(minify())
        .pipe(rename({suffix : '.min'}))
        .pipe(gulp.dest('./dist/css/')) 
});

gulp.task('default', ['watch']);

gulp.task('watch', ['coffee','less'], function(){
    gulp.watch('./src/coffee/*.coffee', ['coffee']);
    gulp.watch('./src/less/*.less', ['less']);
});