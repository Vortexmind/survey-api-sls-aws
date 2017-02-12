'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.export = (event, context, callback) => {

  if (typeof parseInt(event.pathParameters.id) !== 'number') {
    console.error(error);
    callback(new Error('Validation error in the ID passed'));
    return;
  }

  const params = {
    TableName: process.env.RESPONSES_TABLE,
    KeyConditionExpression: 'surveyId = :hkey',
    ExpressionAttributeValues: {
      ':hkey': parseInt(event.pathParameters.id),
    }
  };

  dynamoDb.query(params, (error, result) => {

    if (error) {
      console.error(error);
      callback(new Error('Couldn not fetch the responses'));
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
