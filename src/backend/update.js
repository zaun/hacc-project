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
    if (row[0] === 'Notes:' || row[1] === 'Notes:') {
      return false;
    }

    // OTHER
    if (row[0] === 'Source (unless otherwise noted):') {
      return false;
    }
    if (row[0] === 'References:') {
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
        var fA = parseFloat(value);
        var fB = Number(value);
        if (!isNaN(fA) && !isNaN(fB)) {
          value = fA;
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
     * Table C-1a
     */
    function (nextStep) {
      importData(data, 'tableC1a', null, 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          physicalStateA: cleanValue(row[2]),
          physicalStateB: cleanValue(row[3]),
          unrestrictedLand: cleanValue(row[4]),
          commercialLand: cleanValue(row[5])
        };
      }, nextStep);
    },

    /*
     * Table C-1b
     */
    function (nextStep) {
      importData(data, 'tableC1b', null, 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          physicalStateA: cleanValue(row[2]),
          physicalStateB: cleanValue(row[3]),
          unrestrictedLand: cleanValue(row[4]),
          commercialLand: cleanValue(row[5])
        };
      }, nextStep);
    },

    /*
     * Table C-2
     */
    function (nextStep) {
      importData(data, 'tableC2', 'TABLE C-2. 1SHALLOW SOIL VAPOR ACTION LEVELS', 6, function (row) {
        return {
          chemical: cleanValue(row[0]),
          physicalStateA: cleanValue(row[1]),
          physicalStateB: cleanValue(row[2]),
          residentialLowest: cleanValue(row[3]),
          residentialCarcinogenicEffects: cleanValue(row[4]),
          residentialNoncarcinogenicEffects: cleanValue(row[5]),
          commercialLowest: cleanValue(row[6]),
          commercialCarcinogenicEffects: cleanValue(row[7]),
          commercialNoncarcinogenicEffects: cleanValue(row[8])
        };
      }, nextStep);
    },

    /*
     * Table C-3
     */
    function (nextStep) {
      importData(data, 'tableC3', 'TABLE C-3. INDOOR AIR ACTION LEVELS', 7, function (row) {
        return {
          chemical: cleanValue(row[0]),
          physicalStateA: cleanValue(row[1]),
          physicalStateB: cleanValue(row[2]),
          unitRiskFactor: cleanValue(row[3]),
          referenceConcentration: cleanValue(row[4]),
          unrestrictedLowest: cleanValue(row[5]),
          unrestrictedIndoorCarcinogens: cleanValue(row[6]),
          unrestrictedIndoorNoncarcinogens: cleanValue(row[7]),
          commercialLowest: cleanValue(row[8]),
          commercialCarcinogenicEffects: cleanValue(row[9]),
          commercialNoncarcinogenicEffects: cleanValue(row[10])
        };
      }, nextStep);
    },

    /*
     * Table D-1a
     */
    function (nextStep) {
      importData(data, 'tableD1a', 'TABLE D-1a. GROUNDWATER ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalGroundwaterActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          drinkingWaterToxicity: cleanValue(row[4]),
          vaporIntrusion: cleanValue(row[5]),
          aquaticHabitatImpacts: cleanValue(row[6])
        };
      }, nextStep);
    },

    /*
     * Table D-1b
     */
    function (nextStep) {
      importData(data, 'tableD1b', 'TABLE D-1b. GROUNDWATER ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalGroundwaterActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          drinkingWaterToxicity: cleanValue(row[4]),
          vaporIntrusion: cleanValue(row[5]),
          aquaticHabitatImpacts: cleanValue(row[6])
        };
      }, nextStep);
    },

    /*
     * Table D-1c
     */
    function (nextStep) {
      importData(data, 'tableD1c', 'TABLE D-1c. GROUNDWATER ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalGroundwaterActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          vaporIntrusion: cleanValue(row[4]),
          aquaticHabitatImpacts: cleanValue(row[5])
        };
      }, nextStep);
    },

    /*
     * Table D-1d
     */
    function (nextStep) {
      importData(data, 'tableD1d', 'TABLE D-1d. GROUNDWATER ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalGroundwaterActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          vaporIntrusion: cleanValue(row[4]),
          aquaticHabitatImpacts: cleanValue(row[5])
        };
      }, nextStep);
    },

    /*
     * Table D-2a
     */
    function (nextStep) {
      importData(data, 'tableD2a', 'TABLE D-2a. SURFACE WATER ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalGroundwaterActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          drinkingWaterToxicity: cleanValue(row[4]),
          vaporIntrusion: cleanValue(row[5]),
          aquaticHabitatImpacts: cleanValue(row[6])
        };
      }, nextStep);
    },

    /*
     * Table D-2b
     */
    function (nextStep) {
      importData(data, 'tableD2b', 'TABLE D-2b. SURFACE WATER ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalGroundwaterActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          vaporIntrusion: cleanValue(row[4]),
          aquaticHabitatImpacts: cleanValue(row[5])
        };
      }, nextStep);
    },

    /*
     * Table D-2c
     */
    function (nextStep) {
      importData(data, 'tableD2c', 'TABLE D-2c. SURFACE WATER ACTION LEVELS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalGroundwaterActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          vaporIntrusion: cleanValue(row[4]),
          aquaticHabitatImpacts: cleanValue(row[5])
        };
      }, nextStep);
    },

    /*
     * Table D-3a
     */
    function (nextStep) {
      importData(data, 'tableD3a', 'TABLE D-3a. FINAL DRINKING WATER ACTION LEVELS FOR HUMAN TOXICITY', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          finalActionLevel: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          grossContamination: cleanValue(row[3]),
          HDOHPrimaryMCL: cleanValue(row[4]),
          otherCriteria: cleanValue(row[5]),
          reference: cleanValue(row[6]),
          riskBasedAcctionLevel: cleanValue(row[7]),
          basisB: cleanValue(row[8])
        };
      }, nextStep);
    },

    /*
     * Table D-3b
     */
    function (nextStep) {
      importData(data, 'tableD3b', 'TABLE D-3b. RISK-BASED ACTION LEVELS FOR TAPWATER', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          lowestTapwaterGoal: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          carcinogenicEffects: cleanValue(row[3]),
          mutagenicEffects: cleanValue(row[4]),
          noncancerEffects: cleanValue(row[5])
        };
      }, nextStep);
    },

    /*
     * Table D-4a
     */
    function (nextStep) {
      importData(data, 'tableD4a', 'TABLE D-4a.  SUMMARY OF AQUATIC HABITAT GOALS', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          estuarineChronicAquaticToxicity: cleanValue(row[1]),
          estuarineAcuteAquaticToxicity: cleanValue(row[2]),
          freshwaterChronicAquaticToxicity: cleanValue(row[3]),
          freshwaterAcuteAquaticToxicity: cleanValue(row[4]),
          marineChronicAquaticToxicity: cleanValue(row[5]),
          marineAcuteAquaticToxicity: cleanValue(row[6])
        };
      }, nextStep);
    },

    /*
     * Table D-4b
     */
    function (nextStep) {
      importData(data, 'tableD4b', 'TABLE D-4b. SUMMARY OF SELECTED CHRONIC AQUATIC HABITAT GOALS', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          estuarineAquaticHabitatGoal: cleanValue(row[1]),
          estuarineBasis: cleanValue(row[2]),
          freshwaterAquaticHabitatGoal: cleanValue(row[3]),
          freshwaterBasis: cleanValue(row[4]),
          marineAquaticHabitatGoal: cleanValue(row[5]),
          marineBasis: cleanValue(row[6])
        };
      }, nextStep);
    },

    /*
     * Table D-4c
     */
    function (nextStep) {
      importData(data, 'tableD4c', 'TABLE D-4c. SUMMARY OF SELECTED ACUTE AQUATIC HABITAT GOALS', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          estuarineAquaticHabitatGoal: cleanValue(row[1]),
          estuarineBasis: cleanValue(row[2]),
          freshwaterAquaticHabitatGoal: cleanValue(row[3]),
          freshwaterBasis: cleanValue(row[4]),
          marineAquaticHabitatGoal: cleanValue(row[5]),
          marineBasis: cleanValue(row[6])
        };
      }, nextStep);
    },

    /*
     * Table D-4d
     */
    function (nextStep) {
      importData(data, 'tableD4d', 'TABLE D-4d. SUMMARY OF HAWAI\'I CHRONIC AND ACUTE', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          freshwaterChronic: cleanValue(row[1]),
          freshwaterAcute: cleanValue(row[2]),
          saltwaterChronic: cleanValue(row[3]),
          saltwaterAcute: cleanValue(row[4])
        };
      }, nextStep);
    },

    /*
     * Table D-4e
     */
    function (nextStep) {
      importData(data, 'tableD4e', 'TABLE D-4e. SUMMARY OF USEPA AND OTHER PUBLISHED AQUATIC HABITAT GOALS', 5, function (row) {
        return {
          chemical: cleanValue(row[0]),
          freshwaterUSEPAChronic: cleanValue(row[1]),
          freshwaterUSEPAAcute: cleanValue(row[2]),
          freshwaterOtherChronic: cleanValue(row[3]),
          freshwaterBasisChronic: cleanValue(row[4]),
          freshwaterOtherAcute: cleanValue(row[5]),
          freshwaterBasisAcute: cleanValue(row[6]),
          marineUSEPAChronic: cleanValue(row[7]),
          marineUSEPAAcute: cleanValue(row[8]),
          marineOtherChronic: cleanValue(row[9]),
          marineBasisChronic: cleanValue(row[10]),
          marineOtherAcute: cleanValue(row[11]),
          marineBasisAcute: cleanValue(row[12])
        };
      }, nextStep);
    },

    /*
     * Table D-4f
     */
    function (nextStep) {
      importData(data, 'tableD4f', 'TABLE D-4f. SURFACE WATER QUALITY STANDARDS FOR BIOACCUMULATION', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          selectedCriteria: cleanValue(row[1]),
          basis: cleanValue(row[2]),
          HIDOHWQS: cleanValue(row[3]),
          USEPANWQC: cleanValue(row[4])
        };
      }, nextStep);
    },

    /*
     * Table D-5
     */
    function (nextStep) {
      importData(data, 'tableD5', 'TABLE D-5. CALIFORNIA AGRICULTURAL', 4, function (row) {
        return {
          chemical: cleanValue(row[0]),
          agriculturalWaterQualityGoals: cleanValue(row[1])
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
