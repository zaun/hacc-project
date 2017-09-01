var gulp = require('gulp');
var path = require('path');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var plugins = require('gulp-load-plugins')();

process.stdin.setRawMode(true);

/*
 * Helper tasks
 */

gulp.task('downloadDynamoDB', function () {
  return plugins.download({
    file: 'dynamodb.zip',
    url: 'https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.zip'
  }).pipe(gulp.dest('build/'));
});

gulp.task('getDynamoDB', function () {
  return gulp.src('build/dynamodb.zip')
    .pipe(plugins.unzip())
    .pipe(gulp.dest('build/dynamodb'));
});

gulp.task('clean', function () {
  return gulp.src('build/')
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

/**
 * Client build
 **/

var bableOptions = {
  presets: [['es2015', { 'modules': false }], 'stage-2'],
  plugins: ['transform-runtime']
};

var webpackModule = {
  rules: [{
    test: /\.js$/,
    exclude: /node_modules\//,
    loader: 'babel-loader',
    options: bableOptions
  }, {
    test: /\.styl$/,
    loaders: ['style-loader', 'css-loader', 'stylus-loader']
  }, {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      loaders: {
        js: 'babel-loader?' + JSON.stringify(bableOptions)
      },
      preLoaders: {
        js: 'istanbul-instrumenter-loader?esModules=true'
      }
    }
  }, {
    test: /\.json$/,
    loaders: ['json-loader']
  }, {
    enforce: 'post',
    test: /\.js$/,
    exclude: /mode_modules|test\//,
    loader: 'istanbul-instrumenter-loader',
    query: {
      esModules: true
    }
  }]
};

var webpackResolve = {
  modules: ['./node_modules'],
  alias: { vue: 'vue/dist/vue.js' }
};

gulp.task('clientCopyStatic', ['clean', 'lint'], function () {
  return gulp.src('src/client/static/**/*')
    .pipe(gulp.dest('build/client/'));
});

gulp.task('clientPug', ['clean'], function () {
  return gulp.src('src/client/pug/**/*')
    .pipe(plugins.pug())
    .pipe(gulp.dest('build/client'));
});

gulp.task('clientWebpack', ['clean', 'lint'], function () {
  return gulp.src('src/client/main.js')
    .pipe(webpackStream({
      watch: false,
      module: webpackModule,
      resolve: webpackResolve,
      output: {
        filename: 'app.js'
      }
    }, webpack))
    .pipe(gulp.dest('build/client/js'));
});

gulp.task('clientDist', ['clientCopyStatic', 'clientPug', 'clientWebpack'], function () {
  return gulp.src('build/client/**/*')
    .pipe(plugins.copy('dist/s3/', { prefix: 2 }));
});

/**
 * Server build
 **/

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

gulp.task('buildClient', ['clean', 'clientCopyStatic', 'clientPug', 'clientWebpack']);
gulp.task('buildServer', ['serverCopy', 'backendInstall']);
gulp.task('dist', ['cloudformation', 'buildServer', 'serverZip', 'clientDist']);
gulp.task('default', ['buildClient', 'buildServer']);
