'use strict'

const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
const dynamoDBParams = {apiVersion: '2012-08-10', region: region}

module.exports = function() {
  if (process.env.DYNAMODB_LOCAL_PORT) {
    dynamoDBParams.endpoint = new AWS.Endpoint('http://localhost:' + process.env.DYNAMODB_LOCAL_PORT)
  }

  return new AWS.DynamoDB.DocumentClient(dynamoDBParams)
}
