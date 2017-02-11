'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.name !== 'string' || typeof data.id  !== 'number') {
    console.error('Validation Failed');
    callback(new Error('Could not create survey'));
    return;
  }

  const params = {
    TableName: process.env.SURVEYS_TABLE,
    ConditionExpression: 'attribute_not_exists(surveyId)',
    Item: {
      surveyId: data.id,
      name : data.name,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Could not create survey'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
