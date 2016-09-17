'use strict';

var browserify = require('browserify');
var config = require('../config');
var partialify = require('partialify');
var gulp = require('gulp');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var source = require('vinyl-source-stream');
var glob = require('glob');
var proxyquire = require('proxyquireify');


/*Nothing in vendor was ever used.
I suspect it was solely for bower deps
but i can live w/o bower. Leaving
this here as an example of how to
create a second bundle

gulp.task('vendor', function() {
  return browserify({debug: true})
    .require('when')
    .require('mustache')
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest(config.dist + '/scripts/'));
});*/

gulp.task('tests', function() {
  var testFiles = glob.sync("./app/tests/*.mocha.js");
  return browserify({debug: true})
    .plugin(proxyquire.plugin)
    .add("./app/tests/main.js")
    .add(testFiles)
    .bundle()
    .pipe(source('tests.js'))
    .pipe(gulp.dest(config.dist + '/scripts/'));
});

// Browserify
gulp.task('browserify', function() {
  return browserify({debug: true})
    .add('./app/scripts/main.js')
    .transform(partialify) // Transform to allow requireing of templates
    .bundle()
    .on('error', function(e) {
        console.error(e.stack);
        this.emit('end');
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest(config.dist + '/scripts/'))
});

// Script Dist
gulp.task('scripts:dist', function() {
  return gulp.src(['dist/scripts/*.js'], {base: 'dist'})
    .pipe(gulp.dest('dist'))
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(rename('script-manifest.json'))
    .pipe(gulp.dest('dist'));
});
