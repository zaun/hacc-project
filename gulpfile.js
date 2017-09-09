var gulp = require('gulp');
var path = require('path');
var plugins = require('gulp-load-plugins')();

process.stdin.setRawMode(true);

var env = (process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development');

/*
 * Helper tasks
 */

gulp.task('downloadDynamoDB', function () {
  return plugins.downloadStream({
    file: 'dynamodb.zip',
    url: 'https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.zip'
  }).pipe(gulp.dest('build/'));
});

gulp.task('getDynamoDB', ['downloadDynamoDB'], function () {
  return gulp.src('build/dynamodb.zip')
    .pipe(plugins.unzip())
    .pipe(gulp.dest('build/dynamodb'));
});

gulp.task('clean', function () {
  return gulp.src(['build/backend'])
    .pipe(plugins.clean());
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError());
});

gulp.task('cloudformation', ['clean', 'lint'], function () {
  var swagger = require('fs').readFileSync(path.join(__dirname, '/etc/swagger.yaml')).toString('utf-8');
  var parts = swagger.split(/@@([A-Za-z]+)/g).map(function (part, index) {
    if (index % 2 === 0) {
      return JSON.stringify(part);
    } else {
      return '{ "Fn::GetAtt" : ["' + part + '", "Arn"] }';
    }
  });

  return gulp.src(['etc/cloudformation.json'])
    .pipe(plugins.replace(/@@swagger/g, function (match, part) {
      return '{ "Fn::Join": ["", [ ' + parts.join(', ') + ' ]] }';
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('cloudformationEast', ['clean', 'lint'], function () {
  return gulp.src('etc/us-east-1-cloudformation.json')
    .pipe(plugins.copy('dist/', { prefix: 2 }));
});
/**
 * Server build
 **/

gulp.task('serverConfig', ['clean', 'lint'], function () {
  var config = './config/' + env + '.json';
  return gulp.src(config)
    .pipe(plugins.rename('config.json'))
    .pipe(gulp.dest('build/backend/'));
});

gulp.task('serverCopy', ['clean', 'lint'], function () {
  return gulp.src('src/backend/**/*')
    .pipe(plugins.copy('build/backend/', { prefix: 2 }));
});

gulp.task('backendInstall', ['serverCopy'], function () {
  return gulp.src('build/backend/*')
    .pipe(gulp.dest('build/backend/'))
    .pipe(plugins.install());
});

gulp.task('serverZip', ['backendInstall'], function () {
  return gulp.src('build/backend/**/*')
    .pipe(plugins.zip('backend.zip'))
    .pipe(gulp.dest('dist'));
});

/**
 * General Tasks
 **/

gulp.task('buildServer', ['serverConfig', 'serverCopy', 'backendInstall']);
gulp.task('dist', ['cloudformation', 'cloudformationEast', 'buildServer', 'serverZip']);
gulp.task('default', ['buildServer']);
