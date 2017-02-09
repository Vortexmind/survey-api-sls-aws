'use strict';

module.exports.surveys = (event, context, callback) => {

  const done = (err, res) => callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
          'Content-Type': 'application/json',
      },
  });

  switch (event.httpMethod) {
      case 'DELETE':
          dynamo.deleteItem(JSON.parse(event.body), done);
          break;
      case 'GET':
          dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
          break;
      case 'POST':
          dynamo.putItem(JSON.parse(event.body), done);
          break;
      case 'PUT':
          dynamo.updateItem(JSON.parse(event.body), done);
          break;
      default:
          done(new Error('Unsupported method "${event.httpMethod}"'));
  }
};
