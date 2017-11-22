let gulp = require('gulp');
let preprocess = require('gulp-preprocess');

let source = './environment.ts';
let dest = './src/environments/';

function getEnvTask(context) {
  return function() {
    gulp.src(source)
      .pipe(preprocess({context: context}))
      .pipe(gulp.dest(dest));
  }
}

gulp.task('develop', getEnvTask({ ENV: 'develop' }));
gulp.task('production', getEnvTask({ ENV: 'production' }));
