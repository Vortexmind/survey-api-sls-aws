'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const validateResponses = function(responsesList) {

  if (!(Array.isArray(questionList))) return false;

  for (var i=0; i < responsesList.length; i++) {
    if (typeof responsesList[i].question !== 'string' ||
        !(Array.isArray(responsesList[i].answers)) ) return false;
    for (var j=0; j < responsesList[i].answers.length; j++) {
      if (typeof responsesList[i].answers[j] !== 'string') return false;
    }
  }
  return true;
}

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.surveyId !== 'number' || !(validateResponses(data.responses))) {
    console.error('Validation Failed');
    callback(new Error('Could not create survey response'));
    return;
  }

  const params = {
    TableName: process.env.RESPONSES_TABLE,
    Item: {
      surveyId: data.surveyId,
      MapAttribute: data.responses,
      createdAt: timestamp,
      updatedAt: timestamp
    },
    ConditionExpression: 'attribute_not_exists(surveyId)'
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
