var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var replace = require('gulp-replace');
var notify = require('gulp-notify');
var hogan = require('gulp-hogan');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');

function handleErrors(errorObject, callback) {
  notify.onError(errorObject.toString().split(': ').join(':\n')).apply(this, arguments);
  // Keep gulp from hanging on this task
  if (typeof this.emit === 'function') this.emit('end');
}

var paths = {
  less: {
    src: ['./src/am-style.less'],
    all: './src/**/*.less'
  },
  html: {
    src: ['./docs/*.hogan'],
    all: './docs/**/*.hogan'
  },
  static: {
    src: ['./static/*'],
    all: './static/*'
  },
  fonts: {
    src: ['./src/fonts/*'],
    all: './src/fonts/*'
  }
}

var browsers = [
  'ios >= 6',
  'android >= 2.3'
];

gulp.task('serve', function() {
  browserSync.init({
    server: './demo',
    port: 8555
  });
});

gulp.task('less', function() {
  return gulp.src(paths.less.src)
    .pipe(less())
    .pipe(postcss([
      autoprefixer({ browsers: browsers }),
      cssnano()
    ]))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./demo/css'));
});

gulp.task('html', function() {
  gulp.src(paths.html.src)
    .pipe(hogan({}, null, '.html'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./demo'));
});

gulp.task('static', function() {
  gulp.src(paths.static.src)
    .pipe(gulp.dest('./demo'))
});

gulp.task('fonts', function() {
  gulp.src(paths.fonts.src)
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(gulp.dest('./demo/fonts'))
});

gulp.task('watch', function() {
  gulp.watch(paths.less.all, ['less']);
  gulp.watch(paths.html.all, ['html']);
  gulp.watch(paths.static.all, ['static']);
});

gulp.task('build', ['less', 'html', 'static', 'fonts']);
gulp.task('default', ['build', 'watch', 'serve']);
