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
        if (test && !_.startsWith(data, test)) {
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
            sheet: key,
            rows: rows
          }
        };
        dynamodb.put(params, nextStep);
      }
    ], function (err) {
      done(err);
    });
  };

  var cleanValue = function (value) {
    if (value) {
      value = value.trim();
    }
    if (value === '-') {
      value = null;
    }
    if (value) {
      try {
        var f = parseFloat(value);
        if (!isNaN(f)) {
          value = f;
        }
      } catch (e) { }
    }
    return value || null;
  };

  // Process the incoming data
  async.waterfall([
    /*
     * Chemical List
     */
    function (nextStep) {
      importData(data, 'chemicalList', null, 4, function (row) {
        return {
          cas: cleanValue(row[0]),
          chemical: cleanValue(row[1]),
          cancerResidential: cleanValue(row[2]),
          cancerCI: cleanValue(row[3]),
          cancerWorkers: cleanValue(row[4]),
          hardQuotient: cleanValue(row[5]),
          metal: cleanValue(row[6]),
          volatile: cleanValue(row[7]),
          persistant: cleanValue(row[8]),
          modeledKoc: cleanValue(row[9]),
          code: cleanValue(row[10]),
          notes: cleanValue(row[11])
        };
      }, nextStep);
    },

    /*
     * Summary A
     */
    function (nextStep) {
      importData(data, 'summaryA', 'TABLE A.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          soilOver: cleanValue(row[1]),
          groundwaterOver: cleanValue(row[2]),
          soilUnder: cleanValue(row[3]),
          groundwaterUnder: cleanValue(row[4])
        };
      }, nextStep);
    },

    /*
     * Summary B
     */
    function (nextStep) {
      importData(data, 'summaryB', 'TABLE B.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          soilOver: cleanValue(row[1]),
          groundwaterOver: cleanValue(row[2]),
          soilUnder: cleanValue(row[3]),
          groundwaterUnder: cleanValue(row[4])
        };
      }, nextStep);
    },

    /*
     * Summary C
     */
    function (nextStep) {
      importData(data, 'summaryC', 'TABLE C.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          physicalStateA: cleanValue(row[1]),
          physicalStateB: cleanValue(row[2]),
          indoorAirResidential: cleanValue(row[3]),
          indoorAirCommercial: cleanValue(row[4]),
          shallowSoilResidential: cleanValue(row[5]),
          shallowSoilCommercial: cleanValue(row[6])
        };
      }, nextStep);
    },

    /*
     * Summary D
     */
    function (nextStep) {
      importData(data, 'summaryD', 'TABLE D.  ENVIRONMENTAL ACTION LEVELS (EALs)', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          freshwater: cleanValue(row[1]),
          marine: cleanValue(row[2]),
          estuarine: cleanValue(row[3])
        };
      }, nextStep);
    },

    /*
     * Table A-1
     */
    function (nextStep) {
      importData(data, 'tableA1', 'TABLE A-1.  SOIL ACTION LEVELS', 6, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalEAL: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          terrestrialEcotoxicity: cleanValue(row[4]),
          background: cleanValue(row[5]),
          directExposure: cleanValue(row[6]),
          vaporIntrusion: cleanValue(row[7]),
          drinkingWaterResource: cleanValue(row[8])
        };
      }, nextStep);
    },

    /*
     * Table A-2
     */
    function (nextStep) {
      importData(data, 'tableA2', 'TABLE A-2.  SOIL ACTION LEVELS', 6, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalEAL: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          terrestrialEcotoxicity: cleanValue(row[4]),
          background: cleanValue(row[5]),
          directExposure: cleanValue(row[6]),
          vaporIntrusion: cleanValue(row[7]),
          drinkingWaterResource: cleanValue(row[8])
        };
      }, nextStep);
    },

    /*
     * Table B-1
     */
    function (nextStep) {
      importData(data, 'tableB1', 'TABLE B-1.  SOIL ACTION LEVELS', 6, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalEAL: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          terrestrialEcotoxicity: cleanValue(row[4]),
          background: cleanValue(row[5]),
          directExposure: cleanValue(row[6]),
          vaporIntrusion: cleanValue(row[7]),
          drinkingWaterResource: cleanValue(row[8])
        };
      }, nextStep);
    },

    /*
     * Table B-2
     */
    function (nextStep) {
      importData(data, 'tableB2', 'TABLE B-2.  SOIL ACTION LEVELS', 6, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalEAL: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          terrestrialEcotoxicity: cleanValue(row[4]),
          background: cleanValue(row[5]),
          directExposure: cleanValue(row[6]),
          vaporIntrusion: cleanValue(row[7]),
          drinkingWaterResource: cleanValue(row[8])
        };
      }, nextStep);
    },

    /*
     * Summary L
     */
    function (nextStep) {
      importData(data, 'tableL', 'TABLE L. SOIL ECOTOXICITY ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          residential: cleanValue(row[1]),
          commercial: cleanValue(row[2])
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
