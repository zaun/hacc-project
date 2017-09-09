'use static';

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

AWS.config.update(awsOptions);
var dynamodb = new AWS.DynamoDB();
var doc = new AWS.DynamoDB.DocumentClient();

async.waterfall([
  function (nextStep) {
    dynamodb.listTables({}, nextStep);
  },

  function (data, nextStep) {
    if (_.includes(data.TableNames, 'ealData')) {
      var params = {
        TableName: "ealData"
       };
       doc.scan(params, nextStep);
    } else {
      nextStep(new Error('ealData not found'));
    }
  },

  function (data, nextStep) {
    var table = process.argv[process.argv.length - 1];
    nextStep(null, _.find(data.Items, { name: table }));
  }
], function (err, data) {
  if (err) {
    console.log('Error: ', err);
    return;
  }
  console.log(data)
});
