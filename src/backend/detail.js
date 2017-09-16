'use static';

var AWS = require('aws-sdk');
var async = require('async');
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
  if (row && row[field]) {
    return row[field];
  } else {
    return '-';
  }
};

var scanAll = function (done) {
  var exclusiveStartKey;
  var items = [];
  async.doUntil(function (nextStep) {
    var params = {
      TableName: 'ealData'
    };
    if (exclusiveStartKey) {
      params.ExclusiveStartKey = exclusiveStartKey;
    }
    doc.scan(params, nextStep);
  }, function (data) {
    items = _.concat(items, data.Items);
    exclusiveStartKey = data.LastEvaluatedKey;
    return exclusiveStartKey === undefined;
  }, function (err) {
    done(err, items);
  });
};

exports.handler = function (event, context) {
  var ret = {
    eals: []
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

  scanAll(function (err, tables) {
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
      /*
       * Soil Action Levels
       */

      // Direct Exposure
      var unrestrictedSoilDirect = vlookup(lookupChemical, _.find(tables, { sheet: 'tableI1' }), 'finalActionLevel');
      var commercialSoilDirect = vlookup(lookupChemical, _.find(tables, { sheet: 'tableI2' }), 'finalActionLevel');
      var constructionSoilDirect = vlookup(lookupChemical, _.find(tables, { sheet: 'tableI3' }), 'finalActionLevel');

      // Vapor Intrusion
      var unrestrictedSoilVapor = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC1b' }), 'unrestrictedLand');
      var commercialSoilVapor = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC1b' }), 'commercialLand');

      // Leaching
      var drinkingUnderSoilLeaching = vlookup(lookupChemical, _.find(tables, { sheet: 'tableE' }), 'leachingIsDrinkingWithin150');
      var drinkingOverSoilLeaching = vlookup(lookupChemical, _.find(tables, { sheet: 'tableE' }), 'leachingIsDrinkindNotWithin105');
      var nonDrinkingUnderSoilLeaching = vlookup(lookupChemical, _.find(tables, { sheet: 'tableE' }), 'leachingNotDrinkingWithin150');
      var nonDrinkingOverSoilLeaching = vlookup(lookupChemical, _.find(tables, { sheet: 'tableE' }), 'leachingNotDrinkingNotWithin105');

      // Terrestrial Ecotoxicity
      var unrestrictedSoilEcotoxicity = vlookup(lookupChemical, _.find(tables, { sheet: 'tableL' }), 'residential');
      var commercialSoilEcotoxicity = vlookup(lookupChemical, _.find(tables, { sheet: 'tableL' }), 'commercial');

      // Gross Contamination
      var unrestrictedSoilExposed = vlookup(lookupChemical, _.find(tables, { sheet: 'tableF2' }), 'unrestrictedFinalActionLevel');
      var unrestrictedSoilIsolated = vlookup(lookupChemical, _.find(tables, { sheet: 'tableF3' }), 'unrestrictedFinalActionLevel');
      var commercialSoilExposed = vlookup(lookupChemical, _.find(tables, { sheet: 'tableF2' }), 'commercialFinalActionLevel');
      var commercialSoilIsolated = vlookup(lookupChemical, _.find(tables, { sheet: 'tableF3' }), 'commercialFinalActionLevel');

      var soil = {
        category: 'soil',
        label: 'Soil Environmental Hazards',
        site: null,
        unit: 'mg/kg',
        hazards: [{
          hazard: 'Direct Exposure',
          unrestricted: unrestrictedSoilDirect,
          commercial: commercialSoilDirect,
          construction: constructionSoilDirect,
          goal: false
        }, {
          hazard: 'Vapor Emissions To Indoor Air',
          unrestricted: unrestrictedSoilVapor,
          commercial: commercialSoilVapor,
          goal: false
        }, {
          hazard: 'Leaching (threat to groundwater)',
          drinking: {
            over: drinkingOverSoilLeaching,
            under: drinkingUnderSoilLeaching
          },
          nonDrinking: {
            over: nonDrinkingOverSoilLeaching,
            under: nonDrinkingUnderSoilLeaching
          },
          goal: false
        }, {
          hazard: 'Terrestrial Ecotoxicity',
          unrestricted: unrestrictedSoilEcotoxicity,
          commercial: commercialSoilEcotoxicity,
          goal: false
        }, {
          hazard: 'Gross Contamination',
          unrestricted: {
            exposed: unrestrictedSoilExposed,
            isolated: unrestrictedSoilIsolated
          },
          commercial: {
            exposed: commercialSoilExposed,
            isolated: commercialSoilIsolated
          },
          goal: false
        }]
      };

      console.log(JSON.stringify(soil));
      ret.eals.push(soil);

      /*
       * Groundwater Action Levels
       */

      // Drinking Water Toxicity
      var drinking = vlookup(lookupChemical, _.find(tables, { sheet: 'tableD3a' }), 'finalActionLevel');

      // Vapor Intrusion
      var unrestrictedVapor = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC1a' }), 'unrestrictedLand');
      var commercialVapor = vlookup(lookupChemical, _.find(tables, { sheet: 'tableC1a' }), 'commercialLand');

      // Aquatic Ecotoxicity
      var chronicAquatic = vlookup(lookupChemical, _.find(tables, { sheet: 'tableD4a' }), 'estuarineChronicAquaticToxicity');
      var acuteAquatic = vlookup(lookupChemical, _.find(tables, { sheet: 'tableD4a' }), 'estuarineAcuteAquaticToxicity');

      // Gross Contamination
      var drinkingGross = vlookup(lookupChemical, _.find(tables, { sheet: 'tableG1' }), 'finalActionLevel');
      var nonDrinkingGross = vlookup(lookupChemical, _.find(tables, { sheet: 'tableG2' }), 'finalActionLevel');

      var groud = {
        category: 'groundwater',
        label: 'Groundwater Environmental Hazards',
        site: null,
        unit: 'ug/L',
        basis: '',
        hazards: [{
          hazard: 'Drinking Water (Toxicity)',
          drinking: drinking,
          nonDrinking: '-',
          goal: false
        }, {
          hazard: 'Vapor Emissions To Indoor Air',
          unrestricted: unrestrictedVapor,
          commercial: commercialVapor,
          goal: false
        }, {
          hazard: 'Aquatic Ecotoxicity',
          unrestricted: chronicAquatic,
          commercial: acuteAquatic,
          goal: false
        }, {
          hazard: 'Gross Contamination',
          drinking: drinkingGross,
          nonDrinking: nonDrinkingGross,
          goal: false
        }]
      };

      // console.log(JSON.stringify(groud));
      ret.eals.push(groud);

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
