var gulp        = require('gulp');
var browserSync = require('browser-sync');

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });

  gulp.watch('app/*.html').on('change', browserSync.reload);
  gulp.watch('app/css/*.css').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync']);
