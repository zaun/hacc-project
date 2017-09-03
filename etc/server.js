const express = require('express');
var bodyParser = require('body-parser');

var rawParser = bodyParser.text();

const app = express();

var callBackend = function (req, res, cb) {
  var headers = req.headers;
  headers['x-forwarded-for'] = '::1';
  headers['x-forwarded-proto'] = 'http';

  var event = {
    path: req.path,
    httpMethod: req.method,
    headers: headers,
    queryStringParameters: req.query,
    body: req.body.toString(),
    pathParameters: undefined,
    requestContext: {
      requestId: '50517ad1-e2bd-4066-ad5c-bda5cb0ffd38'
    }
  };

  var backend = require('../build/backend');
  backend.handler(event, {
    succeed: function (result) {
      cb(result);
    },
    fail: function (result) {
      cb(result);
    }
  })
}

app.all('*', rawParser, function (req, res) {
  callBackend(req, res, function (result) {
    res.status(result.statusCode).send(result.body);
  })
});

app.listen(7111, function () {
  console.log('API listening on port 7111.');
});
