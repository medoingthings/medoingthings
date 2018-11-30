var gulp = require('gulp');
var gulpconfig = require('./gulpconfig')

/**
 * Modules
 */
var autoprefixer = require('gulp-autoprefixer');
var livereload   = require('gulp-livereload');
var modernizr    = require('gulp-modernizr');
var rjs          = require('gulp-requirejs');
var sass         = require('gulp-sass')
var uglify       = require('gulp-uglify');

/**
 * Gulp Build Tasks
 */

gulp.task('default', ['copy', 'sass', 'javascript']);
gulp.task('build', ['default', 'assets', 'modernizr']);

/**
 * Gulp Tasks
 * @return {[type]} [description]
 */

gulp.task('assets', function () {
  gulp.src(gulpconfig.assets.src)
    .pipe(gulp.dest(gulpconfig.assets.dest))
});

gulp.task('copy', function () {
  gulp.src(gulpconfig.copy.js.src)
    .pipe(gulp.dest(gulpconfig.copy.js.dest))
});

gulp.task('javascript', function() {

    // Unfortunately, this config can’t be moved to gulpconfig.js
    // When the watch task triggers this task for the second time, there is
    // an error thrown regarding path.js #wtf
    rjs({
        baseUrl: '.',
        out: 'medoingthings.js',
        deps: ['console', 'modules/main'],
        paths: {
            'analytics': 'lib/js/analytics',
            'api-talk': 'lib/js/api-talk',
            'console': 'bower_components/h5bp-console-polyfill/console',
            'requirejs': 'bower_components/requirejs/require',
            'zeptojs': 'lib/js/zepto.min'
        },
        shim: {
            'zeptojs': {
                exports: '$'
            },
            'analytics': {
                exports: 'ga'
            }
        },

        // optimizer stuff
        name: 'modules/main',
        include: [
            'requirejs',
            'console',
            'analytics'
            ]
    })
    .pipe(uglify())
    .pipe(gulp.dest(gulpconfig.js.dest))
});

gulp.task('modernizr', function () {
  gulp.src([gulpconfig.sass.modules, gulpconfig.js.src])
    .pipe(modernizr(gulpconfig.modernizr.settings))
    .pipe(uglify())
    .pipe(gulp.dest(gulpconfig.js.dest))
});

gulp.task('sass', function () {
    gulp.src(gulpconfig.sass.modules)
        .pipe(sass(gulpconfig.sass.options))
        .pipe(autoprefixer(gulpconfig.autoprefixer))
        .pipe(gulp.dest(gulpconfig.css.dest));
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(gulpconfig.sass.modules, ['sass']).on('change', livereload.changed);
    gulp.watch(gulpconfig.js.src, ['javascript']).on('change', livereload.changed);
});
