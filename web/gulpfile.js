var gulp = require('gulp');
var gulpNgConfig = require('gulp-ng-config');

gulp.task('dev', function () {
  gulp.src('configFile.json')
  .pipe(gulpNgConfig('kamrusepa.config',{
      environment: 'local'
  }))
  .pipe(gulp.dest('./app'))
});

gulp.task('prod', function () {
  gulp.src('configFile.json')
  .pipe(gulpNgConfig('kamrusepa.config',{
      environment: 'production'
  }))
  .pipe(gulp.dest('./app'))
});