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

// Build
gulp.task('build', ['html', 'browserify', 'appendages']);

gulp.task('appendages', function() {
	return gulp.src(['app/css/**/*', 'app/templates/**/*', 'app/graphics/**/*'], {base: 'app'})
		.pipe(gulp.dest(config.dist));
});