'use static';

exports.handler = function (event, context) {
  context.succeed({
    statusCode: 200,
    body: JSON.stringify(event, null, 2)
  });
};
