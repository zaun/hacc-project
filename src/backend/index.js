'use static';

/*
 * This file should only validate the incoming route. No route
 * specific logic should be in this file.
 */

var _ = require('lodash');

exports.handler = function (event, context) {
  var path = event.path.toLowerCase().replace(/^\/api/, '');
  path = path.replace(/\/$/, '');

  var loadRoute = function (path) {
    var route = require(path);
    route.handler(event, context);
  };

  var methodNotFound = function (method) {
    context.succeed({
      statusCode: 405,
      body: 'Method Not Allowed: ' + event.httpMethod
    });
  };

  switch (path) {
    case '/update':
      if (_.includes(['POST'], event.httpMethod)) {
        loadRoute('./update.js');
      } else {
        methodNotFound();
      }
      break;

    default:
      context.succeed({
        statusCode: 404,
        body: 'Not Found: ' + path
      });
      break;
  }
};
