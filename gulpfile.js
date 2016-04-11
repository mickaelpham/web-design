var autoprefixer = require('autoprefixer'),
    browserSync  = require('browser-sync'),
    cssimport    = require('postcss-import'),
    cssnext      = require('postcss-cssnext'),
    csswring     = require('csswring'),
    del          = require('del'),
    gulp         = require('gulp'),
    imagemin     = require('gulp-imagemin'),
    mqpacker     = require('css-mqpacker'),
    postcss      = require('gulp-postcss'),
    sourcemaps   = require('gulp-sourcemaps');

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
    cssimport(), // import all CSS into one file
    cssnext(),   // use next-generation CSS
    mqpacker(),  // move similar media-queries together
    csswring()   // compact the sh** out of it
  ];

  return gulp.src('app/css/styles.css')
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
    },

    notify: false
  });
});

gulp.task('build', ['clean', 'html', 'css', 'images']);
gulp.task('default', ['html', 'css', 'images', 'browser-sync']);
