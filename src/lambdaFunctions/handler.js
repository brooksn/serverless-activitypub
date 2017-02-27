'use strict';
//const AWS = require('aws-sdk')

module.exports.hello = (event, context, callback) => {
  console.log('Hello!')
  const response = {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin": "*"},
    body: JSON.stringify({
      message: `Go Serverless v1.0! Your function executed successfully! QUEUE_WORKER_NAME: ${process.env.QUEUE_WORKER_NAME}, API_BASE: ${process.env.API_BASE}, typeof event.body: ${typeof event.body}`,
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
