'use static';

var config = require('./config.json');

exports.handler = function (event, context) {
  console.log(1, event);
  context.succeed({
    statusCode: '200',
    body: config
  });
};
