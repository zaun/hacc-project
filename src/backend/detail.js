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
    unrestricted: {
      drinking: {
        less: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        },
        more: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        }
      },
      nondrinking: {
        less: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        },
        more: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        }
      }
    },
    restricted: {
      drinking: {
        less: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        },
        more: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        }
      },
      nondrinking: {
        less: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        },
        more: {
          soil: 0.3,
          groundwater: 5.0,
          soilVapor: 719.9
        }
      }
    }
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
