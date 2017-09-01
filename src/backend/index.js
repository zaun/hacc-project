'use static';

var config = require('config.json');

exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: '200',
    body: config
  });
};
