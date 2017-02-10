'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: "survey-api-table",
};

module.exports.list = (event, context, callback) => {

  dynamoDb.scan(params, (error, result) => {

    if (error) {
      console.error(error);
      callback(new Error('Couldn not fetch the surveys'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
