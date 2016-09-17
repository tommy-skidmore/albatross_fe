'use strict';

var config = require('../config');
var gulp   = require('gulp');
var rev    = require('gulp-rev');

// Build
gulp.task('doDist', ['build'], function() {
  return gulp.src(config.dist+'/**/*')
    .pipe(gulp.dest('dist'))
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['clean'], function () {
    gulp.start('doDist');
});