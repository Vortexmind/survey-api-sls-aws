'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.name !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Could not update the survey'));
    return;
  }

  const params = {
    TableName: process.env.SURVEYS_TABLE,
    Key: {
      surveyId: parseInt(event.pathParameters.id),
    },
    ExpressionAttributeNames: {
      '#survey_name': 'name',
    },
    ExpressionAttributeValues: {
      ':name': data.name,
      ':updatedAt': timestamp,
    },
    ConditionExpression: 'attribute_exists(createdAt)',
    UpdateExpression: 'SET #survey_name = :name, updatedAt = :updatedAt, createdAt = if_not_exists(createdAt,:updatedAt)',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Could not update the survey'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
