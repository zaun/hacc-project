'use static';

var AWS = require('aws-sdk');
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
var doc = new AWS.DynamoDB.DocumentClient();

var vlookup = function (chemical, table, field) {
  var row = _.find(table.rows, { chemical: chemical });
  // console.log(row);
  if (row) {
    return row[field];
  } else {
    return '-';
  }
};

exports.handler = function (event, context) {
  var ret = {
    eals: [{
      category: 'soil',
      label: 'Soil Environmental Hazards',
      site: null,
      unit: 'mg/kg',
      hazards: [{
        hazard: 'Direct Exposure',
        eal: 15
      }, {
        hazard: 'Vapor Emissions To Indoor Air',
        eal: 16
      }, {
        hazard: 'Terrestrial Ecotoxicity',
        eal: 'Site Specific'
      }, {
        hazard: 'Gross Contamination',
        eal: 17
      }, {
        hazard: 'Leaching (threat to groundwater)',
        eal: 18
      }]
    }, {
      category: 'groundwater',
      label: 'Groundwater Environmental Hazards',
      site: null,
      unit: 'ug/L',
      hazards: [{
        hazard: 'Drinking Water (Toxicity)',
        eal: 15
      }, {
        hazard: 'Vapor Emissions To Indoor Air',
        eal: 16
      }, {
        hazard: 'Aquatic Ecotoxicity',
        eal: 17
      }, {
        hazard: 'Gross Contamination',
        eal: 18
      }]
    }]
  };

  var lookupChemical;

  // Get the passed JSON data
  try {
    var data = JSON.parse(event.body);
    lookupChemical = data.chemical;
  } catch (e) {
    context.succeed({
      statusCode: 500,
      body: e.message
    });
    return;
  }

  var params = {
    TableName: 'ealData'
  };

  doc.scan(params, function (err, data) {
    if (err) {
      console.log('Error:');
      console.log(err);
      context.succeed({
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        },
        body: err.message
      });
    } else {
      const tables = data.Items;

      /*
       * Indoor Air and Soil Gas Action Levels
       */

      // Indoor Air
      var unrestrictedAir = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC3' }), 'unrestrictedLowest');
      var commercialAir = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC3' }), 'commercialLowest');

      // Soil Gas
      var unrestrictedSoil = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC2' }), 'residentialLowest');
      var commercialSoil = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC2' }), 'commercialLowest');

      var vapor = {
        category: 'vapor',
        label: 'Other Tier 1 EALs',
        site: null,
        unit: 'ug/m3',
        hazards: [{
          hazard: 'Indoor Air',
          unrestricted: unrestrictedAir,
          commercial: commercialAir,
          goal: true
        }, {
          hazard: 'Soil Gas',
          unrestricted: unrestrictedSoil,
          commercial: commercialSoil,
          goal: false
        }]
      };

      // console.log(JSON.stringify(vapor));
      ret.eals.push(vapor);

      context.succeed({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*'
        },
        body: JSON.stringify(ret)
      });
    }
  });
};
