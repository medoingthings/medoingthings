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

gulp.task('default', ['sass', 'templates', 'javascript']);
gulp.task('build', ['assets', 'modernizr', 'sass', 'templates', 'javascript']);

/**
 * Gulp Tasks
 * @return {[type]} [description]
 */

gulp.task('assets', function () {
  gulp.src(gulpconfig.assets.src)
    .pipe(gulp.dest(gulpconfig.assets.dest))
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
            'twitter-follow': 'lib/js/twitter-follow',
            'zeptojs': 'lib/js/zepto.min'
        },
        shim: {
            'zeptojs': {
                exports: '$'
            },
            'analytics': {
                exports: 'ga'
            },
            'twitter-follow' : {}
        },

        // optimizer stuff
        name: 'modules/main',
        include: [
            'requirejs',
            'console',
            'twitter-follow',
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

gulp.task('templates', function () {
  gulp.src(gulpconfig.templates.src)
    .pipe(gulp.dest(gulpconfig.templates.dest))
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(gulpconfig.sass.modules, ['sass']).on('change', livereload.changed);
    gulp.watch(gulpconfig.templates.src, ['templates']).on('change', livereload.changed);
    gulp.watch(gulpconfig.js.src, ['javascript']).on('change', livereload.changed);
});
