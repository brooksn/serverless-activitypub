'use strict'
const assert = require('assert')
const AWSMock = require('aws-sdk-mock')
const DB = require('../../db.js')
const Outbox = require('../../classes/Outbox.js')
const createNote = require('../../../test/sampleData/createNote.json')

describe('insertObjectIntoCollection', () => {
  let insertObjectIntoCollection = null
  before(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => callback(null, params))
    insertObjectIntoCollection = new DB().insertObjectIntoCollection
  })
  
  it('should make a put request to the DocumentClient when passed valid parameters', () => {
    return insertObjectIntoCollection({
      username: 'john',
      actor: createNote.actor,
      activityType: 'Update',
      object: createNote.object,
      collection: 'Inbox',
      endpoint: 'Inbox'
    })
    .then(params => {
      assert.equal('-Posts', params.TableName.substr(-6))
      assert.equal(params.Item.join_username_modified.split('_')[1], params.Item.join_collection_modified.split('_')[1])
      assert.equal(params.Item.is_public, false)
    })
  })
  
  it('should throw an error if username is missing', done => {
    insertObjectIntoCollection({
      actor: createNote.actor,
      activityType: 'Update',
      object: createNote.object,
      collection: 'Inbox',
      endpoint: 'Inbox'
    }).catch(err => {
      assert.ok(err)
      done()
    })
  })
  
  it('should throw an error if actor is missing', done => {
    insertObjectIntoCollection({
      username: 'john',
      activityType: 'Update',
      object: createNote.object,
      collection: 'Inbox',
      endpoint: 'Inbox'
    }).catch(err => {
      assert.ok(err)
      done()
    })
  })


  it('should throw an error if activityType is missing', done => {
    insertObjectIntoCollection({
      username: 'john',
      actor: createNote.actor,
      object: createNote.object,
      collection: 'Inbox',
      endpoint: 'Inbox'
    }).catch(err => {
      assert.ok(err)
      done()
    })
  })
  
  it('should throw an error if object is missing', done => {
    insertObjectIntoCollection({
      username: 'john',
      actor: createNote.actor,
      activityType: 'Update',
      collection: 'Inbox',
      endpoint: 'Inbox'
    }).catch(err => {
      assert.ok(err)
      done()
    })
  })
  
  it('should throw an error if collection is missing', done => {
    insertObjectIntoCollection({
      username: 'john',
      actor: createNote.actor,
      activityType: 'Update',
      object: createNote.object,
      endpoint: 'Inbox'
    }).catch(err => {
      assert.ok(err)
      done()
    })
  })
  
  it('should throw an error if endpoint is missing', done => {
    insertObjectIntoCollection({
      username: 'john',
      actor: createNote.actor,
      activityType: 'Update',
      object: createNote.object,
      collection: 'Inbox'
    }).catch(err => {
      assert.ok(err)
      done()
    })
  })


  after(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'put')
  })
})
