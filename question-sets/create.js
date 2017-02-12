'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

var validateQuestions = function(questionList){

  if (!(Array.isArray(questionList))) return false;

  for (var i=0; i < questionList.length; i++) {
    if (typeof questionList[i].question !== 'string' ||
        !(Array.isArray(questionList[i].answers)) ) return false;
    for (var j=0; j < questionList[i].answers.length; j++) {
      if (typeof questionList[i].answers[j] !== 'string') return false;
    }
  }
  return true;
}

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.surveyId  !== 'number' || !(validateQuestions(data.questions)) ) {
    console.error('Validation Failed');
    callback(new Error('Could not create question set'));
    return;
  }

  const params = {
    TableName: process.env.QUESTION_SETS_TABLE,
    Item: {
      surveyId: data.surveyId,
      MapAttribute: data.questions,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    ConditionExpression: 'attribute_not_exists(surveyId)'
  };

  dynamoDb.put(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Could not create questions set'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
