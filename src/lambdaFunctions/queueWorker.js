'use strict';
/*
  This lambda function should be invoked by an event, and will not provide a response. 
  It checks the provided message queue, and delivers any available messages to the deliverTo attribute until timeout.
 */
const AWS = require('aws-sdk')
global.fetch = require('node-fetch')
const discoverInbox = require('../functions/discoverInbox.js')
const deliverToCollection = require('../functions/deliverToCollection.js')
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
const sqs = new AWS.SQS({apiVersion: '2012-11-05', region: region})
const numberOfDeliveriesPerWorker = 20

const readQueueAndSendNotifications = function readQueueAndSendNotifications(queueUrl, context) {
  const sqsParams = {QueueUrl: queueUrl, MessageAttributeNames: ['All'], MaxNumberOfMessages: 10}
  sqs.receiveMessage(sqsParams).promise()
  .then(data => {  
    const messages = Array.isArray(data.Messages) ? data.Messages : []
    const messageCount = messages.length
    let completedMessages = 0
    messages.forEach(message => {
      let deliverTo = ''
      try {
        deliverTo = message.MessageAttributes.deliverTo.StringValue
      } catch(e) {}
      if (!deliverTo || deliverTo.length < 1) return;

      discoverInbox(deliverTo).then(inboxUrl => deliverToCollection(inboxUrl, message.Body))
    })
  })
}

module.exports.handler = function queueWorker(event, context, callback) {
  const queueUrl = event.QueueUrl
  readQueueAndSendNotifications(queueUrl, context)

  //const result = {context: context, event: event}
  //callback(null, {statusCode: 200, body: JSON.stringify(result)})
}

//module.exports.handler({QueueUrl: 'https://sqs.us-east-1.amazonaws.com/958396848643/activitypub-outgoing-notifications'}, {getRemainingTimeInMillis: () => 12000}, () => {})
