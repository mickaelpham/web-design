var autoprefixer = require('autoprefixer');
var browserSync  = require('browser-sync');
var cssnext      = require('postcss-cssnext');
var csswring     = require('csswring');
var del          = require('del');
var gulp         = require('gulp');
var imagemin     = require('gulp-imagemin');
var mqpacker     = require('css-mqpacker');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');

var paths = {
  css:    'app/css/*.css',
  html:   'app/*.html',
  images: 'app/images/**/*'
};

// Clean up build folder
gulp.task('clean', function() {
  return del(['build']);
});

// Post CSS transformation
gulp.task('css', function() {
  var processors = [
    cssnext(),
    mqpacker(),
    csswring()
  ];

  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest('build/images'));
});

// Copy all HTML files
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('build'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.css, ['css']); // note: CSS are injected directly
  gulp.watch(paths.html, ['html']).on('change', browserSync.reload);
  gulp.watch(paths.images, ['images']).on('change', browserSync.reload);
});

// Static server
gulp.task('browser-sync', ['watch'], function() {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });
});

gulp.task('default', ['html', 'css', 'images', 'browser-sync']);
