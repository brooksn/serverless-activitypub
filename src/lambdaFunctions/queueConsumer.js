'use strict';
/*
  This lambda function should be invoked by an event, and will not provide a response. 
  It checks one or more message queues, determines the number of parallel workers to use to clear the queue,
  and invokes those functions with an event.
 */
const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
const getServerlessJson = require('../functions/getServerlessJson.js')
const serverlessJSON = getServerlessJson()
const resources = serverlessJSON.resources.Resources
const sqs = new AWS.SQS({apiVersion: '2012-11-05', region: region})
const queueName = resources.OutgoingNotifications.Properties.QueueName
const workerArn = process.env.QUEUE_WORKER_ARN
const numberOfDeliveriesPerWorker = 10

module.exports.handler = function queueConsumer(event, context, callback) {
  sqs.getQueueUrl({QueueName: queueName}).promise()
  .then(res => {
    if (!res.QueueUrl) return Promise.reject('QueueUrl could not be discovered. ')
    const sqsParams = {QueueUrl: res.QueueUrl, AttributeNames: ['ApproximateNumberOfMessages']}
    return Promise.all([res.QueueUrl, sqs.getQueueAttributes(sqsParams).promise()])
  })
  .then(res => {
    const queueUrl = res[0]
    const data = res[1]
    const numberOfMessages = data.Attributes.ApproximateNumberOfMessages
    let numberOfWorkers = numberOfMessages <= 0 ? 0 : Math.ceil(numberOfMessages/numberOfDeliveriesPerWorker)

    if (numberOfWorkers > 0) {
      const lambda = new AWS.Lambda({apiVersion: '2015-03-31', region: region})
      const lambdaPromises = []
      const lambdaParams = {InvocationType: 'Event', FunctionName: workerArn, Payload: `{"QueueUrl": "${queueUrl}"}`}
      for (let i = 0; i < numberOfWorkers; i++) {
        lambdaPromises.push(lambda.invoke(lambdaParams).promise())
      }
      return Promise.all(lambdaPromises)
    } else return Promise.resolve([])
  })
  .then(res => {
    const result = {
      data: {
        numberOfWorkers: Array.isArray(res) ? res.length : 0,
        numberOfDeliveriesPerWorker: numberOfDeliveriesPerWorker
      }
    }
    return callback(null, {headers: {'Access-Control-Allow-Origin': '*'}, statusCode: 200, body: JSON.stringify(result)})
  })
  .catch(err => callback(err))
}

