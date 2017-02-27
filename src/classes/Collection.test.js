'use strict'
const assert = require('assert')
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const DynamoDB = require('../../test/functions/DynamoDB.js')
const AWSMock = require('aws-sdk-mock')
const fetchMock = require('fetch-mock')
const Collection = require('./Collection.js')
const compactActivityFromObjectOrActivity = require('../functions/compactActivityFromObjectOrActivity.js')
const createNote = require('../../test/sampleData/createNote.json')
const updateNote = require('../../test/sampleData/updateNote.json')
const followers = ['https://bcc.org/~john/', 'https://example.com/zoe', 'https://example.com/zachary']

describe('Collection', () => {
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

  describe('create', () => {
    //const collection = new Collection()
  })
  
  describe('updateCollection', () => {
    
  })
  
  describe('toJSON', () => {
    
  })

  describe('delete', () => {
    
  })
  /*
  describe('makeInsertObjectParams', () => {
    it('should return parameters for db.insertObjectIntoCollection', done => {
      new Collection({username: process.env.TEST_USERNAME, endpoint: 'Outbox'})
      .makeInsertObjectParams(createNote)
      .then(params => {
        assert.ok(params.username)
        assert.equal(process.env.TEST_USERNAME, params.username)
        assert.equal(createNote['@context'], params.object['@context'])
        assert.equal('Outbox', params.collection)
        assert.equal('Outbox', params.endpoint)
        done()
      })
    })
  })
  
  describe('updateObjectFromCompactActivity Inbox endpoint', () => {
    it('should return an activity from a compact activity', done => {
      new Collection({username: process.env.TEST_USERNAME, endpoint: 'Outbox'})
      .updateObjectFromCompactActivity(updateNote)
      .then(completeActivity => {
        assert.equal('This is an updated note.', completeActivity.object.content)
        assert.equal(createNote.object.id, completeActivity.object.id, 'New and old object ID should be the same')
        assert.equal(updateNote.id, completeActivity.id, 'The provided activity ID should not be changed when using the Inbox endpoint')
        assert.notEqual(createNote.id, completeActivity.id, 'New and old activity ID should not be the same')
        done()
      })
    })
  })
  
  describe('deleteObjectFromCompactActivity', () => {
    it('should return an activity from a compact activity')
  })
  
  describe('toJSON', () => {
    it('should return an activitystreams collection of objects, excluding bcc and bto fields on objects')
  })
  
  describe('saveObjectFromObjectOrActivity', () => {

    it('should return an activity from an activity', done => {
      new Collection({username: process.env.TEST_USERNAME, endpoint: 'Outbox'})
      .saveObjectFromObjectOrActivity(createNote)
      .then(activity => {
        assert.equal(createNote['@context'], activity['@context'])
        assert.equal(createNote.object.id, activity.object.id)
        done()
      })
    })
  })
  */
  after(() => {
    dynamoDBProcess.stop()
    fetchMock.restore()
  })
})
