/**
 * Global Configuration for Gulp Tasks
 */
module.exports = {
  autoprefixer: {
    browsers: [
      'last 4 versions',
      'ie 9',
      'android 2.3',
      'android 4',
      'opera 12'
    ],
    cascade: false
  },
  browsersync: {
    options: {
      proxy: "http://medoingthings.dev",
      notify: false,
      open: 'local'
    }
  },
  clean: {
    path: [
      'www/public/dist',
      'www/craft/templates'
    ]
  },
  copy: {
    js: {
      libs: {
        src: 'assets/js/libs/*.js',
        dest: 'dist/js/libs'
      }
    }
  },
  css: {
    dest: 'www/public/dist/css'
  },
  imagemin: {
    src: 'assets/images/**/*',
    options: {
      progressive: true,
      interlaced: true,
      svgoPlugins: [
        {removeUnknownsAndDefaults: false},
        {cleanupIDs: false}]
    },
    dest: 'www/public/dist/images'
  },
  javascript: {
    all: 'components/**/*.js',
    src: 'components/*.js',
    dest: 'www/public/dist/js'
  },
  modernizr: {
    settings: {
      'cache' : true,
      'options' : [
        'setClasses',
          'html5printshiv'
      ]
    }
  },
  preDom: {
    src: [
      'www/public/dist/js/modernizr.js',
      'node_modules/picturefill/dist/picturefill.js'
    ],
    file: 'predom.js',
    dest: 'www/public/dist/js'
  },
  sass: {
    options: {
      development: {
        outputStyle : 'nested',
          precision: 10,
          sourceMap: true
      },
      production: {
        outputStyle : 'compressed',
          precision: 10,
          sourceMap: false
      }
    },
    src: 'components/**/*.scss'
  },
  templates: {
    src: 'templates/**/*.twig',
    dest: 'www/craft/templates'
  },
  webpack: {
    options: {
      output: {
        filename: 'medoingthings.js',
      }
    }
  }
}
