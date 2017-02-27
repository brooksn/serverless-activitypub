'use strict'
const assert = require('assert')
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const DynamoDB = require('../../test/functions/DynamoDB.js')
const AWSMock = require('aws-sdk-mock')
const fetchMock = require('fetch-mock')
const Outbox = require('./Outbox.js')
const traverseJsonLD = require('../functions/traverseJsonLD.js')
const compactActivityFromObjectOrActivity = require('../functions/compactActivityFromObjectOrActivity.js')
const createNote = require('../../test/sampleData/createNote.json')
const updateNote = require('../../test/sampleData/updateNote.json')
const followers = ['https://bcc.org/~john/', 'https://example.com/zoe', 'https://example.com/zachary']
const activityPubContext = 'https://www.w3.org/ns/activitystreams'

describe('Outbox', () => {
  let dynamoDBProcess;
  
  before(function(done) {
    this.timeout(6000)

    fetchMock.mock(updateNote.object.id, updateNote.object)

    dynamoDBProcess = new DynamoDB()
    dynamoDBProcess.start()
    .then(() => dynamoDBProcess.setup())
    .then(() => {
      done()
    })
    .catch(err => {
      console.error(err)
    })
  })
  
  describe('update', () => {
    const updateActivity = Object.assign({}, updateNote)

    before(done => {
      new Outbox({username: process.env.TEST_USERNAME, endpoint: 'Outbox'})
      .create(createNote)
      .then(completeActivity => {
        const objectID = traverseJsonLD.getValues(completeActivity, 'object.id', activityPubContext)['object.id']
        traverseJsonLD.setValues(updateActivity, {'object.id': objectID}, activityPubContext)
        done()
      })
    })
    
    it('should return an activity from a compact activity', done => {
      new Outbox({username: process.env.TEST_USERNAME, endpoint: 'Outbox'})
      .update(updateActivity)
      .then(completeActivity => {
        assert.equal('This is an updated note.', completeActivity.object.content)
        assert.equal(updateActivity.object.id, updateActivity.object.id, 'New and old object ID should be the same')
        assert.equal(false, !!completeActivity.id, 'When the endpoint is "Outbox", strip the activity ID')
        done()
      })
    })
  })
  
  describe('create', () => {
    it('should return a Create activity from an object')
  })
  
  describe('delete', () => {
    it('should return an activity from a compact activity')
  })

  after(() => {
    dynamoDBProcess.stop()
    fetchMock.restore()
  })
})
