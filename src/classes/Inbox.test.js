'use strict'
const assert = require('assert')
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const AWSMock = require('aws-sdk-mock')
const fetchMock = require('fetch-mock')
const Inbox = require('./Inbox.js')
const compactActivityFromObjectOrActivity = require('../functions/compactActivityFromObjectOrActivity.js')
const createNote = require('../../test/sampleData/createNote.json')
const updateNote = require('../../test/sampleData/updateNote.json')
const followers = ['https://bcc.org/~john/', 'https://example.com/zoe', 'https://example.com/zachary']

describe('Inbox', () => {
  before(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      if (params.IndexName === 'user_collection_GSI' && params.ExpressionAttributeValues[':col'] === 'Followers') {
        callback(null, {Items: followers.map(u => ({object: u}))}) 
      } else if (params.ExpressionAttributeValues[':hkey'] === createNote.object.id) {
        callback(null, {Items: [{object: createNote.object}]})
      }
    })
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, params)
    })
    fetchMock.mock(updateNote.object.id, updateNote.object)
  })
  
  describe('update', () => {
    it('should return an activity from a compact activity')
  })
  
  describe('delete', () => {
    it('should return an activity from a compact activity')
  })
  
  describe('toJSON', () => {
    it('should return an activitystreams collection of objects, excluding bcc and bto fields on objects')
  })

  after(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'query')
    AWSMock.restore('DynamoDB.DocumentClient', 'put')
    fetchMock.restore()
  })
})
