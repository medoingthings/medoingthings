/**
 * Global Configuration for Gulp Tasks
 */

module.exports = {
    assets: {
        src: 'assets/**/*.*',
        dest: './cms/web/assets'
    },
    autoprefixer: {
        browsers: ['last 4 versions'],
        cascade: false
    },
    copy: {
        js: {
            src: [
                'bower_components/picturefill/dist/picturefill.min.js'
            ],
            dest: 'cms/web/dist/js'
        }
    },
    css: {
        dest: './cms/web/dist/css'
    },
    js: {
        src: 'modules/**/*.js',
        dest: 'cms/web/dist/js'
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
    }
}
