'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.SURVEYS_TABLE,
};

module.exports.list = (event, context, callback) => {

  dynamoDb.scan(params, (error, result) => {

    if (error) {
      console.error(error);
      callback(new Error('Couldn not fetch the surveys'));
      return;
    }

    var bodyVal = (result.Count > 0) ? result.Items : {};

    const response = {
      statusCode: 200,
      body: JSON.stringify(bodyVal)
    };
    callback(null, response);
  });
};
