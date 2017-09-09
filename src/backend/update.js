'use static';

var AWS = require('aws-sdk');
var async = require('async');
var csv = require('csv');
var _ = require('lodash');

var config = require('./config.json');

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
var dynamodb = new AWS.DynamoDB.DocumentClient();

/*
 * Parse a CSV data URI into array of arrays
 */
var getCSV = function (data, cb) {
  if (_.startsWith(data, 'data:text/csv;base64,')) {
    var buf;
    if (typeof Buffer.from === 'function') {
      buf = Buffer.from(data.replace('data:text/csv;base64,', ''), 'base64');
    } else {
      buf = new Buffer(data.replace('data:text/csv;base64,', ''), 'base64');
    }

    csv.parse(buf.toString(), cb);
  } else {
    cb(new Error('Not CSV'));
  }
};

/*
 * Return true if all items in an array equal a given value
 */
var allEqual = function (row, val) {
  for (var i = 0; i < row.length; i++) {
    if (row[i] !== val) {
      return false;
    }
  }
  return true;
};

/*
 * Return all rows until bottom of data
 */
var getDataRows = function (data, cb) {
  var rows = [];

  _.each(data, function (row) {
    // If the entire row is blank, stop
    if (allEqual(row, '')) {
      return false;
    }
    rows.push(row);
  });

  cb(null, rows);
};

exports.handler = function (event, context) {
  var data = {};

  // Get the passed JSON data
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    context.succeed({
      statusCode: 500,
      body: e.message
    });
    return;
  }

  // Process the incoming data
  async.waterfall([
    function (nextStep) {
      getCSV(data.tableL, nextStep);
    },

    function (tableL, nextStep) {
      if (!_.startsWith(tableL, 'TABLE L. SOIL ECOTOXICITY ACTION LEVELS')) {
        nextStep(new Error('Wrong tableL'));
        return;
      }

      getDataRows(tableL.slice(5, 160), nextStep);
    },

    function (tableL, nextStep) {
      var rows = _.map(tableL, function (row) {
        return {
          chemical: row[0],
          residential: row[1],
          commercial: row[2]
        };
      });

      var params = {
        TableName: 'ealData',
        Item: {
          name: 'tableL',
          rows: rows
        }
      };
      dynamodb.put(params, nextStep);
    }
  ], function (err) {
    if (err) {
      context.succeed({
        statusCode: 500,
        body: 'Error: ' + err.message
      });
    } else {
      context.succeed({
        statusCode: 200,
        body: 'OK'
      });
    }
  });
};
