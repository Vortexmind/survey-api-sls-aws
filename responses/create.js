'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.surveyId !== 'number' || typeof data.responses  !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Could not create survey response'));
    return;
  }

  const params = {
    TableName: process.env.RESPONSES_TABLE,
    Item: {
      surveyId: data.id,
      responses: data.responses,
      createdAt: timestamp
    },
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Could not create survey response'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
