'use strict';

var config = require('../config');
var path = require('path');
var gulp = require('gulp');
var cache = require('gulp-cache');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var size = require('gulp-size');

gulp.task('graphics', function() {
	var dest = config.dist + '/graphics';

	return gulp.src('app/graphics/**/*')
		.pipe(changed(dest)) // Ignore unchanged files
		.pipe(imagemin()) // Optimize
		.pipe(gulp.dest(dest));
});


gulp.task('graphics:dist', ['graphics'], function () {
  console.log("graphics DIST");
  return gulp.src(['app/graphics/**/*'], {base: path.resolve('app')})
    // Commenting out the cache section for now.
    // .pipe(gulp.dest('dist'))
    // .pipe(rev())
    // .pipe(cache(imagemin({
    //   optimizationLevel: 3,
    //   progressive: true,
    //   interlaced: false
    // })))
    .pipe(imagemin()) // Optimize
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(size())
    .pipe(rev.manifest())
    .pipe(rename('image-manifest.json'))
    .pipe(gulp.dest('dist'));
});
