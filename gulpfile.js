'use strict';

// Get default configuration
var gulp = require('gulp');
var gulpconfig = require('./gulpconfig');

/**
* Build Modules (ordered alphabetically)
*/
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync');
var del = require('del');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var modernizr = require('gulp-modernizr');
var newer = require('gulp-newer');
var reload = browserSync.reload;
var runSequence = require('run-sequence').use(gulp);
var sass = require('gulp-sass');
var sassLint = require('gulp-sass-lint');
var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');

/**
* All the Gulp tasks (ordered alphabetically)
*
* If you change things: please put all the configuration into gulpconfig.js.
* This makes sure that things can be reused, support readability and
* provide the possibility that they can be adjusted (only if necessary) in
* the projects via the gulpconfig.local.js
*/

// Clean up dist folders to remove outdated files
gulp.task('clean:production', function () {
return del(gulpconfig.clean.path);
});

// Copy assets to the dist folder
gulp.task('copy:js:libs:development', function () {
return gulp.src(gulpconfig.copy.js.libs.src)
  .pipe(gulp.dest(gulpconfig.copy.js.libs.dest));
});

gulp.task('copy:js:libs:production', function () {
return gulp.src(gulpconfig.copy.js.libs.src)
  .pipe(uglify())
  .pipe(gulp.dest(gulpconfig.copy.js.libs.dest));
});

// Losslessly optimize only new images and move them to the dist folder
gulp.task('imagemin:development', function () {
return gulp.src(gulpconfig.imagemin.src)
  .pipe(newer(gulpconfig.imagemin.dest))
  .pipe(imagemin(gulpconfig.imagemin.options))
  .pipe(gulp.dest(gulpconfig.imagemin.dest));
});

// Losslessly optimize all images and move them to the dist folder
gulp.task('imagemin:production', function () {
return gulp.src(gulpconfig.imagemin.src)
  .pipe(imagemin(gulpconfig.imagemin.options))
  .pipe(gulp.dest(gulpconfig.imagemin.dest));
});

// JavaScript Code Style Checker
gulp.task('jscs:development', () => {
return gulp.src(gulpconfig.javascript.all)
  .pipe(jscs())
  .pipe(jscs.reporter());
});

// Build JavaScript files with Browserify
// TODO:
gulp.task('javascript:development', function () {
  return gulp.src(gulpconfig.javascript.src)
      .pipe(webpack(gulpconfig.webpack.options))
      .on('error', function (error) {
          console.log(error.message);
      })
      .pipe(gulp.dest(gulpconfig.javascript.dest));
});

gulp.task('javascript:production', function () {
  return gulp.src(gulpconfig.javascript.src)
      .pipe(webpack(gulpconfig.webpack.options))
      .pipe(uglify())
      .pipe(gulp.dest(gulpconfig.javascript.dest));
});

// Merge javascripts that need to run before the DOM is ready
gulp.task('javascript-predom:development', ['modernizr'], function () {
return gulp.src(gulpconfig.preDom.src)
  .pipe(concat(gulpconfig.preDom.file))
  .pipe(gulp.dest(gulpconfig.preDom.dest));
});

gulp.task('javascript-predom:production', ['modernizr'], function () {
return gulp.src(gulpconfig.preDom.src)
  .pipe(uglify())
  .pipe(concat(gulpconfig.preDom.file))
  .pipe(gulp.dest(gulpconfig.preDom.dest));
});

// Create a task that ensures the `js` task is complete before
// reloading browsers via BrowserSync
gulp.task('javascript-watch', ['javascript:development'], browserSync.reload);

// Enforce JavaScript code style and prevent errors
gulp.task('jshint:development', function() {
return gulp.src(gulpconfig.javascript.all)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'));
});

// Make a Custom Build of Modernizr
var modernizrFiles = [];
modernizrFiles = modernizrFiles.concat(gulpconfig.javascript.all, gulpconfig.sass.src);

// The output will be concatenated by the `javascript-predom` task
gulp.task('modernizr', function () {
return gulp.src(modernizrFiles)
  .pipe(modernizr(gulpconfig.modernizr.settings))
  .pipe(gulp.dest(gulpconfig.javascript.dest));
});

// Compile Sass
gulp.task('sass:development', function () {
return gulp.src(gulpconfig.sass.src)
  .pipe(sass(gulpconfig.sass.options.development).on('error', sass.logError))
  .pipe(autoprefixer(gulpconfig.autoprefixer))
  .pipe(gulp.dest(gulpconfig.css.dest))
  .pipe(browserSync.stream());
});

gulp.task('sass:production', function () {
return gulp.src(gulpconfig.sass.src)
  .pipe(sass(gulpconfig.sass.options.production).on('error', sass.logError))
  .pipe(autoprefixer(gulpconfig.autoprefixer))
  .pipe(gulp.dest(gulpconfig.css.dest));
});

// Code style check for Sass
gulp.task('sasslint:development', function () {
return gulp.src(gulpconfig.sass.src)
  // TODO: activate and fix issues
  // .pipe(sassLint())
  // .pipe(sassLint.format());
});

// Copy templates to the craft folder
gulp.task('templates', function () {
  gulp.src(gulpconfig.templates.src)
    .pipe(gulp.dest(gulpconfig.templates.dest))
});

/**
* Build Tasks for development and production
*/
gulp.task('default', ['build:development']);

// Static Server + watching scss/html files
gulp.task('serve', ['build:development'], function() {

  // Don’t open the browser window automativally, if --no-open argument is passed
  if (process.argv.indexOf('--no-open') !== -1) {
    gulpconfig.browsersync.options.open = false;
  }

  browserSync.init(gulpconfig.browsersync.options);

  gulp.watch(gulpconfig.sass.src, ['sass:development', 'sasslint:development']);
  gulp.watch(gulpconfig.imagemin.src, ['imagemin:development']);
  gulp.watch(gulpconfig.javascript.all, ['javascript-watch', 'jshint:development', 'jscs:development']);
  gulp.watch(gulpconfig.templates.src, ['templates']).on('change', browserSync.reload);
});

// Watching Sass and JavaScript files
gulp.task('watch', ['build:development'], function() {
  gulp.watch(gulpconfig.sass.src, ['sass:development', 'sasslint:development']);
  gulp.watch(gulpconfig.javascript.all, ['javascript-watch', 'jshint:development', 'jscs:development']);
  gulp.watch(gulpconfig.imagemin.src, ['imagemin:development']);
  gulp.watch(gulpconfig.templates.src, ['templates']);
});

// Build files for development (uncompressed)
gulp.task('build:development', [
'copy:js:libs:development',
'imagemin:development',
'javascript:development',
'javascript-predom:development',
'jscs:development',
'jshint:development',
'sass:development',
'sasslint:development',
'templates'
]);

// Build files for production (compression, fail on errors)
gulp.task('build:production', function (callback) {
runSequence('clean:production', [
  'copy:js:libs:production',
  'imagemin:production',
  'javascript:production',
  'javascript-predom:production',
  'sass:production',
  'templates'
], callback);
});
