'use static';

exports.handler = function (event, context) {
  context.succeed({
    statusCode: 200,
    body: event
  });
};
