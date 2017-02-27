'use strict';
const nonce = require('mini-nonce')
const AWS = require('aws-sdk')
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
const getServerlessJson = require('./getServerlessJson.js')
const serverlessJSON = getServerlessJson()
const publicCollection = 'https://www.w3.org/ns/activitystreams#Public'
const queueName = `${serverlessJSON.service}-outgoing-notifications`
const DB = require('../db.js')
const unique = require('./uniqueFlatArray.js')

module.exports.makeNotificationBatches = function makeNotificationBatches(username, activity, dbClient) {
  const db = dbClient || DB()
  return db.getObjects({username: username, collection: 'Followers'})
  .then(items => {
    const followers = items.map(a => a.object)
    //recipients is the list of urls composed of followers, to, bto, cc, bcc, and audience
    const recipients = unique(
      [].concat(followers, activity.to, activity.bto, activity.cc, activity.bcc, activity.audience)
      .filter(element => typeof element === 'string' && element !== publicCollection)
    )
    const recipientGroups = []
    let groupSize = 0
    const bodyId = activity.id || activity.object.id || nonce()
    recipients.forEach(recipient => {
      if (groupSize === 0 || groupSize === 10) {
        recipientGroups.push([])
        groupSize = 0
      }
      const entry = {
        Id: `${bodyId}-${nonce()}`,
        MessageBody: JSON.stringify(activity),
        MessageAttributes: { deliverTo: {StringValue: recipient, DataType: 'String'} }
      }
      recipientGroups[recipientGroups.length-1].push(entry)
      groupSize += 1
    })
    return Promise.resolve(recipientGroups)
  })
}

module.exports.sendNotificationBatchesToQueue = function sendNotificationBatchesToQueue(notificationBatches) {
  const sqs = new AWS.SQS({apiVersion: '2012-11-05', region: region})
  let queueUrl = ''
  return sqs.getQueueUrl({QueueName: queueName}).promise()
  .then(res => {
    if (!res.QueueUrl) return Promise.reject('QueueUrl could not be discovered. ')
    queueUrl = res.QueueUrl
    const sendMessagePromises = []
    notificationBatches.forEach(batch => {
      const sqsParams = { QueueUrl: queueUrl, Entries: batch }
      sendMessagePromises.push(sqs.sendMessageBatch(sqsParams).promise())
    })
    return Promise.all(sendMessagePromises)
  })
}

module.exports.sendActivityNotificationsToQueue = function sendActivityNotificationsToQueue(username, activity) {
  return module.exports.makeNotificationBatches(username, activity)
  .then(batches => module.exports.sendNotificationBatchesToQueue(batches))
}
