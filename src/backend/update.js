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

    // Notes at the end of the file
    if (row[0] === 'Notes:') {
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

  /*
   * Import a single table
   */
  var lastTable = 'None';
  var importData = function (data, key, test, slice, map, done) {
    lastTable = key;
    async.waterfall([
      function (nextStep) {
        getCSV(data[key], nextStep);
      },
      function (data, nextStep) {
        if (!_.startsWith(data, test)) {
          nextStep(new Error('Wrong ' + key));
          return;
        }

        getDataRows(data.slice(slice, data.length), nextStep);
      },
      function (data, nextStep) {
        var rows = _.map(data, map);
        console.log(key, rows[0]);
        console.log(key, rows[rows.length - 1]);

        var params = {
          TableName: 'ealData',
          Item: {
            name: key,
            rows: rows
          }
        };
        dynamodb.put(params, nextStep);
      }
    ], function (err) {
      done(err);
    });
  };

  // Process the incoming data
  async.waterfall([
    /*
     * Summary A
     */
    function (nextStep) {
      importData(data, 'summaryA', 'TABLE A.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: row[0] || null,
          soilOver: row[1] || null,
          groundwaterOver: row[2] || null,
          soilUnder: row[3] || null,
          groundwaterUnder: row[4] || null
        };
      }, nextStep);
    },

    /*
     * Summary B
     */
    function (nextStep) {
      importData(data, 'summaryB', 'TABLE B.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: row[0] || null,
          soilOver: row[1] || null,
          groundwaterOver: row[2] || null,
          soilUnder: row[3] || null,
          groundwaterUnder: row[4] || null
        };
      }, nextStep);
    },

    /*
     * Summary C
     */
    function (nextStep) {
      importData(data, 'summaryC', 'TABLE C.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: row[0] || null,
          physicalStateA: row[1] || null,
          physicalStateB: row[2] || null,
          indoorAirResidential: row[3] || null,
          indoorAirCommercial: row[4] || null,
          shallowSoilResidential: row[3] || null,
          shallowSoilCommercial: row[4] || null
        };
      }, nextStep);
    },

    /*
     * Summary D
     */
    function (nextStep) {
      importData(data, 'summaryD', 'TABLE D.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: row[0] || null,
          freshwater: row[1] || null,
          marine: row[2] || null,
          estuarine: row[3] || null
        };
      }, nextStep);
    },

    /*
     * Summary L
     */
    function (nextStep) {
      importData(data, 'tableL', 'TABLE L. SOIL ECOTOXICITY ACTION LEVELS', 5, function (row) {
        return {
          chemical: row[0] || null,
          residential: row[1] || null,
          commercial: row[2] || null
        };
      }, nextStep);
    }
  ], function (err) {
    if (err) {
      context.succeed({
        statusCode: 500,
        body: 'Error: (' + lastTable + ') ' + err.message
      });
    } else {
      context.succeed({
        statusCode: 200,
        body: 'OK'
      });
    }
  });
};
