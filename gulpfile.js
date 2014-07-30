'use strict';

var version = require('./package.json').version;
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var util = require('gulp-util');
var isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local";

var appCssFileName = 'styles-' + version + '.css';
var appJsFileName = 'app-' + version + '.js';

var dest = 'dist';

var debugOpt = util.env['debug'] ? '--debug' : false;
if(!debugOpt) {
  debugOpt = util.env['debug-brk'] ? '--debug-brk' : false;
}

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'webapp/styles/main.css'
    ])
    .pipe(plugins.concat(appCssFileName))
    .pipe(gulp.dest(dest + '/css'));

  gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.css.map'
    ])
    .pipe(gulp.dest(dest + '/css'));
});

// Javascript concat, setting up browserify.
gulp.task('scripts', function () {
    return gulp.src('webapp/scripts/main.js')
        .pipe(plugins.browserify({
          debug: isDev,
          insertGlobals : true,
          shim: {
            angular: {
              path: 'bower_components/angular/angular.js',
              exports: 'angular'
            },
            'angular-cookies': {
              path: 'bower_components/angular-cookies/angular-cookies.js',
              exports: 'ngCookies',
              depends: {
                  angular: 'angular'
              }
            },
            'angular-route': {
              path: 'bower_components/angular-route/angular-route.js',
              exports: 'ngRoute',
              depends: {
                  angular: 'angular'
              }
            },
            bootstrap: {
              path: 'bower_components/bootstrap/dist/js/bootstrap.js',
              exports: 'bootstrap'
            },
            polymer: {
              path: 'bower_components/polymer/polymer.js',
              exports: 'Polymer'
            }
          }
        }))
        .pipe(plugins.concat(appJsFileName))
        .pipe(plugins.if(!isDev, plugins.uglify()))
        .pipe(gulp.dest(dest + '/js'));
});


// Replaces out js/css callouts w/ htmlReplace lib
gulp.task('html', function() {
  var htmlSrc = 'webapp/*.html';
  var viewSrc = ['webapp/partials/*.html'];


  gulp.src(htmlSrc)
    .pipe(plugins.htmlReplace({
      css: '<link rel="stylesheet" href="/css/' + appCssFileName + '"/>',
      js: '<script type="text/javascript" src="/js/' + appJsFileName + '"></script>'
    }))
    .pipe(gulp.dest(dest + '/html'));

});


gulp.task('images', function () {
  gulp.src('webapp/images/**/*')
    .pipe(plugins.cache(plugins.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(dest + '/images'));


});

gulp.task('clean', function () {
    return gulp.src(['.tmp', 'dist'], { read: false }).pipe(plugins.clean());
});

gulp.task('build', ['html', 'styles', 'scripts', 'images']);

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

gulp.task('watch', function () {
    // watch for changes
    gulp.watch(['webapp/*.html', 'webapp/partials/*.html'], ['html']);
    gulp.watch(['config/*.js', 'webapp/scripts/*.js', 'webapp/scripts/**/*.js'], ['scripts']);
    gulp.watch('webapp/styles/*.css', ['styles']);
    gulp.watch('webapp/images/**/*', ['images']);
});

gulp.task('develop', function () {
  gulp.start('default');
  gulp.start('watch');
  plugins.nodemon({
      script: 'start.js',
      ext: 'js',
      watch: ['start.js', 'server.js', 'servers/', 'lib/', 'config/'],
      delay: 100,
      nodeArgs: debugOpt ? [debugOpt] : null
    })
    .on('restart', function () {
      console.log('restarted!')
    })
});

console.log(plugins.nodemon);

gulp.task('heroku:dev', function() {

  gulp.start('default');
});
