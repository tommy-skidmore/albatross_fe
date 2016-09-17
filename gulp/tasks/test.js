"use strict";

var gulp = require("gulp");
var config = require("../config");

// Default task
gulp.task("test", ["buildTest", "connect", "watch"]);


gulp.task("buildTest", ["tests", "appendages"], function() {
  return gulp.src("app/tests/*.html", {base:"app/tests"})
    .pipe(gulp.dest(config.dist));
});

