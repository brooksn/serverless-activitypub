'use strict'
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const DynamoDB = require('../../test/functions/DynamoDB.js')
const url = require('url')
const nonce = require('mini-nonce')
const assert = require('assert')
const jsonwebtoken = require('jsonwebtoken')
const querystring = require('querystring')

const outbox = require('./outbox.js')
const object = require('./object.js')

const objectJson = {
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Note",
  "content": "This is a note",
  "published": "2015-02-10T15:04:55Z",
  "to": ["https://example.org/~john/"],
  "bcc": ["https://example.org/~alice/"],
  "cc": ["https://example.com/~erik/followers",
         "https://www.w3.org/ns/activitystreams#Public"]
}

describe('object', () => {
  let dynamoDBProcess;
  let globalObjectId;
  let localObjectId;
  
  before(function(done) {
    this.timeout(6000)
    dynamoDBProcess = new DynamoDB()
    dynamoDBProcess.start()
    .then(() => dynamoDBProcess.setup())
    .then(() => {
      const tokenPayload = {username: process.env.TEST_USERNAME, scopes: ['post', 'read'], client_id: 'acme'}
      const clientToken = jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {})
      const postString = JSON.stringify(objectJson)
      outbox.post({body: postString, pathParameters: {username: process.env.TEST_USERNAME}, headers: {Authorization: `bearer ${clientToken}`}}, {}, (err, res) => {
        globalObjectId = res.headers.Location
        const localObjectIdMatch = globalObjectId.match(/\w+$/)
        localObjectId = localObjectIdMatch[0]
        done()
      })
    })
  })
  
  describe('object.get', () => {
    it('should return a post at the url of the Location header', done => {
      const event = {pathParameters: {objectID: localObjectId}}
      object.get(event, {}, (err, res) => {
        const body = JSON.parse(res.body)
        assert.equal(objectJson.content, body.content)
        assert.equal(globalObjectId, body.id)
        done()
      })
    })
  })

  after(() => {
    dynamoDBProcess.stop()
  })
  
})
