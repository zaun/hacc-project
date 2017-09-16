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

var scanAll = function (done) {
  var exclusiveStartKey;
  var items = [];
  async.doUntil(function (nextStep) {
    var params = {
      TableName: "ealData"
     };
     if (exclusiveStartKey) {
       params.ExclusiveStartKey = exclusiveStartKey
     }
     doc.scan(params, nextStep);
  }, function (data) {
    items = _.concat(items, data.Items);
    exclusiveStartKey = data.LastEvaluatedKey;
    return exclusiveStartKey === undefined;
  }, function (err) {
    done(err, items);
  });
}

async.waterfall([
  function (nextStep) {
    dynamodb.listTables({}, nextStep);
  },

  function (data, nextStep) {
    if (_.includes(data.TableNames, 'ealData')) {
       scanAll(nextStep);
    } else {
      nextStep(new Error('ealData not found'));
    }
  },

  function (data, nextStep) {
    if (process.argv.length > 2) {
      var table = process.argv[process.argv.length - 1];
      nextStep(null, _.find(data, { sheet: table }));
    } else {
      nextStep(null, _.chain(data).map(function (i) {
        return i.sheet;
      }).value().sort());
    }
  }
], function (err, data) {
  if (err) {
    console.log('Error: ', err);
    return;
  }
  console.log(data)
});
