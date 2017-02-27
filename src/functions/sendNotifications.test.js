'use strict'
const assert = require('assert')
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const AWSMock = require('aws-sdk-mock')
const sendNotifications = require('./sendNotifications.js')
const makeNotificationBatches = sendNotifications.makeNotificationBatches
const sendNotificationBatchesToQueue = sendNotifications.sendNotificationBatchesToQueue
const activityJson = require('../../test/sampleData/createNote.json')
const followers = ['https://bcc.org/~john/', 'https://example.com/zoe', 'https://example.com/zachary']

describe('sendNotifications', () => {
  before(() => {
    AWSMock.mock('SQS', 'getQueueUrl', (params, callback) => callback(null, { QueueUrl : "http://example.com/queue" }))
    AWSMock.mock('SQS', 'sendMessageBatch', (params, callback) => callback(null, { batch : params }))
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback(null, {Items: followers.map(u => ({object: u}))}) 
    })
  })
  
  describe('makeNotificationBatches', () => {
    it('should make 2 batches', done => {
      makeNotificationBatches(process.env.TEST_USERNAME, activityJson)
      .then(batches => {
        const deliverTo = new Set()
        const a = batches[0].map(a => a.MessageAttributes.deliverTo.StringValue).filter(x => x).forEach(x => deliverTo.add(x))
        const b = batches[1].map(a => a.MessageAttributes.deliverTo.StringValue).filter(x => x).forEach(x => deliverTo.add(x))
        const totalLength = deliverTo.size
        assert.equal(2, batches.length)
        assert.equal(10, batches[0].length)
        assert.equal(5, batches[1].length)
        done()
      })
    })
  })
  
  describe('sendNotificationBatchesToQueue', () => {
    it('should send 2 batches to the queue', done => {
      makeNotificationBatches(process.env.TEST_USERNAME, activityJson)
      .then(batches => sendNotificationBatchesToQueue(batches))
      .then(res => {
        assert.equal(2, res.length)
        assert.ok(true)
        done()
      })
    })
  })

  after(() => {
    AWSMock.restore('SQS', 'getQueueUrl')
    AWSMock.restore('SQS', 'sendMessageBatch')
    AWSMock.restore('DynamoDB.DocumentClient', 'query')
  })
})
