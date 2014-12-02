var gulp = require('gulp'),
    pack = require('path').join(process.cwd(), 'package.json'),
    $ = require('gulp-load-plugins')({
        pattern : 'gulp-*',
        config: pack,
        scope: ['devDependencies'],
        replaceString: 'gulp-',
        camelize: true,
        lazy: true
        
    });

gulp.task('coffee', function () {
    return gulp.src('./src/coffee/*.coffee')
        .pipe($.coffeelint())
        .pipe($.coffeelint.reporter())
        .pipe($.coffee({bare : true })).on('error', $.util.log)
        .pipe(gulp.dest('./tmp/'))
        .pipe($.stripDebug())
        .pipe(gulp.dest('./dist/js/'))
        .pipe($.jshint())
        .pipe($.uglify())
        .pipe($.rename({suffix : '.min'}))
        .pipe(gulp.dest('./dist/js/'))
        .pipe($.livereload({auto: false}));
});

gulp.task('less', function () {
    return gulp.src('./src/less/*.less')
        .pipe($.less()).on('error', $.util.log)
        .pipe(gulp.dest('./dist/css/'))
        .pipe($.minifyCss())
        .pipe($.rename({suffix : '.min'}))
        .pipe(gulp.dest('./dist/css/'))
        .pipe($.livereload({auto: false}));
});

gulp.task('default', ['watch']);

gulp.task('watch', ['coffee','less'], function(){
    $.livereload.listen();
    gulp.watch('./src/coffee/*.coffee', ['coffee']);
    gulp.watch('./src/less/*.less', ['less']);
    gulp.watch('./test/spec/*.js').on('change', $.livereload.changed);
});
