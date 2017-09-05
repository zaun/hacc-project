'use static';

/*
 * This file should only validate the incoming route. No route
 * specific logic should be in this file.
 */

var _ = require('lodash');

// Load an external handler and call it
var loadRoute = function (path, event, context) {
  var route = require(path);
  if (route && route.handler) {
    route.handler(event, context);
  } else {
    context.succeed({
      statusCode: 500,
      body: 'Error loading route: ' + path
    });
  }
};

exports.handler = function (event, context) {
  var path = event.path.toLowerCase().replace(/^\/api/, '');
  path = path.replace(/\/$/, '');

  var methodNotFound = function (method) {
    context.succeed({
      statusCode: 405,
      body: 'Method Not Allowed: ' + event.httpMethod
    });
  };

  switch (path) {
    case '/update':
      if (_.includes(['POST'], event.httpMethod)) {
        loadRoute('./update.js', event, context);
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
