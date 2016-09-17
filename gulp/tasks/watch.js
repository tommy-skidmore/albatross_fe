'use strict';

// var config = require('../config.js');
var gulp = require('gulp');
var livereload = require('gulp-livereload');
console.dir(livereload);

// Watch
gulp.task('watch', ['connect', 'serve'], function () {
    var server = livereload({start: true});
    // Watch for changes in `app` folder
    gulp.watch([
        // 'app/jade/**/*.jade',
        // 'app/*.html',
        // 'app/scss/**/*.scss',
        // 'app/scripts/**/*.js',
        // 'app/graphics/**/*',
        '.tmp/**/*'
    ]).on('change', function(file) {
      //server.changed(file.path);
      livereload.changed(file.path);
    });

    // Watch .js files
    gulp.watch('app/**/*.js', ['browserify', 'tests']);

    // Watch css files
    gulp.watch('app/css/**/*.css', ['build']);

    // Watch image files
    gulp.watch('app/graphics/**/*', ['graphics']);

    // Watch .html files
    gulp.watch('app/**/*.html', ['html']);
});
