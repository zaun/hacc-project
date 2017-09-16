'use static';

var AWS = require('aws-sdk');

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
// var doc = new AWS.DynamoDB.DocumentClient();

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
    }, {
      category: 'vapor',
      label: 'Other Tier 1 EALs',
      site: null,
      unit: 'ug/m3',
      hazards: [{
        hazard: 'Shallow Soil Vapor',
        eal: 15
      }, {
        hazard: 'Indoor Air',
        eal: 14,
        goal: true
      }]
    }]
  };

  context.succeed({
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*'
    },
    body: JSON.stringify(ret)
  });
};
