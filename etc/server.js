const express = require('express');
var cors = require('cors');
var plainTextParser = require('plainTextParser');
var AWS = require('aws-sdk');
var async = require('async');
var _ = require('lodash');

var config = require('../config/development.json');

var awsOptions = {
  region: config.region,
  apiVersion: '2012-08-10'
};

if (config.ddbEndpoint) {
  awsOptions.endpoint = config.ddbEndpoint;
}
if (config.accessKeyId) {
  awsOptions.accessKeyId = config.accessKeyId;
}
if (config.secretAccessKey) {
  awsOptions.secretAccessKey = config.secretAccessKey;
}

console.log(awsOptions);
AWS.config.update(awsOptions);
var dynamodb = new AWS.DynamoDB();

async.waterfall([
  function (nextStep) {
    dynamodb.listTables({}, nextStep);
  },

  function (data, nextStep) {
    if (!_.includes(data.TableNames, 'ealData')) {
      var params = {
        AttributeDefinitions: [{
          AttributeName: "name",
          AttributeType: "S"
        }],
        KeySchema: [{
          AttributeName: "name",
          KeyType: "HASH"
        }],
        ProvisionedThroughput: {
         ReadCapacityUnits: 2,
         WriteCapacityUnits: 1
        },
        TableName: "ealData"
       };
       dynamodb.createTable(params, nextStep);
    } else {
      nextStep();
    }
  }
], function (err) {
  if (err) {
    console.log(err);
    return;
  }

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
      body: req.text,
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

  app.use(cors());

  app.all('*', plainTextParser, function (req, res) {
    console.log(req.method + ': ' + req.url);
    callBackend(req, res, function (result) {
      res.status(result.statusCode).send(result.body);
    })
  });

  app.listen(7111, function () {
    console.log('API listening on port 7111.');
  });
});
