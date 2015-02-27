/**
 * Global Configuration for Gulp Tasks
 */

module.exports = {
    assets: {
        src: 'assets/**/*.*',
        dest: './www/public/assets'
    },
    autoprefixer: {
        browsers: ['last 4 versions'],
        cascade: false
    },
    css: {
        dest: './www/public/dist/css'
    },
    js: {
        src: 'modules/**/*.js',
        dest: 'www/public/dist/js'
    },
    modernizr: {
        settings: {
            'cache' : true,
            'options' : [
                    'setClasses',
                    'html5printshiv',
                    'prefixed'
                ],
            'devFile' : 'bower_components/modernizr/modernizr.js'
        }
    },
    sass: {
        modules: 'modules/**/*.scss',
        options: {
            outputStyle : 'compressed',
            errLogToConsole: true
        }
    },
    templates: {
        src: 'templates/**/*.html',
        dest: 'www/craft/templates'
    }
}
