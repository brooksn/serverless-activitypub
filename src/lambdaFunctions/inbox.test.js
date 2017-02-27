'use strict'
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const DynamoDB = require('../../test/functions/DynamoDB.js')
const AWSMock = require('aws-sdk-mock')
const url = require('url')
const assert = require('assert')
const jsonwebtoken = require('jsonwebtoken')
const querystring = require('querystring')
const authorizePOST = require('./authorize.js').post
const loginPOST = require('./login.js').post
const outbox = require('./outbox.js')
const outboxPOST = outbox.post
const outboxGET = outbox.get
const mockDb = false
const createNote = require('../../test/sampleData/createNote.json')
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

describe('outbox', () => {
  const goodTokenPayload = {username: process.env.TEST_USERNAME, scopes: ['post'], client_id: 'acme'}
  const badTokenPayload = {username: process.env.TEST_USERNAME, scopes: ['read'], client_id: 'acme'}
  const badClientToken = jsonwebtoken.sign(badTokenPayload, process.env.JWT_SECRET, {})
  const goodClientToken = jsonwebtoken.sign(goodTokenPayload, process.env.JWT_SECRET, {})
  const database = []
  let dynamoDBProcess;
  before(function(done) {
    this.timeout(6000)
    if (mockDb === true) {
      AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        if (params.TableName.substr(-6) === '-Users') {
          return callback(null, {Item: {actorUrl: `https://${params.Key.username}.net`, name: 'John Doe'}})
        }
        return callback(new Error('the query parameters were not expected.'))
      })
      AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback(null, {Items: followers.map(u => ({object: u}))}) 
      })
      AWSMock.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
        database.push(params)
        callback(null, params) 
      })
      done()
    } else {
      dynamoDBProcess = new DynamoDB()
      dynamoDBProcess.start()
      .then(res => dynamoDBProcess.setup())
      .then(res => {
        done()
      })
    }
  })
  
  describe('inbox.post', () => {
    it('accepts and saves a public Create activity')
    it('accepts and saves a public Object and wraps it in a public Create activity')
    it('accepts and saves a public Update object')
    it('accepts and saves a private Update object')
    it('rejects a public Create activity authored by an actor listed in the Blocked collection')
  })
  
  describe('inbox.get', () => {
    
  
  })
  
  after(() => {
    if (mockDb === true) {
      AWSMock.restore('DynamoDB.DocumentClient', 'query')
      AWSMock.restore('DynamoDB.DocumentClient', 'put')
      AWSMock.restore('DynamoDB.DocumentClient', 'get')
    } else dynamoDBProcess.stop()
  })
})


/*
describe('outbox', () => {
  describe('outboxPOST and outboxGET',  function() {
    this.timeout(3 * 1000)
    const badClientToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJyb29rcyIsInNjb3BlcyI6WyJhZG1pbiIsInJlYWQiXSwiY2xpZW50X2lkIjoiYWNtZSIsImlhdCI6MTQ4NjQwODQyNH0.3AwcGxR0GHQeO5nmKXf1S8OV5eCrLanCE9tSQtg-h8g'
    let clientToken = ''
    let globalObjectId = ''
    before(done => { //login and get a client token
      const login_qs = querystring.encode({username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD})
      loginPOST({body: login_qs, headers: {}}, {}, (err, res) => {
        const loginJwt = querystring.parse(url.parse(res.headers.Location).query).jwt
        const auth_qs = querystring.encode({scope:"post,read",client_id:"acme",state:'foo',redirect_uri:"http://example.com",authorization:loginJwt,allow:"Allow"})
        authorizePOST({body: auth_qs, pathParameters: {username: 'brooks'}, headers: {}}, {}, (err, res) => {
          const redirectUrl = url.parse(res.headers.Location)
          const redirectUrlQuery = querystring.parse(redirectUrl.query)
          clientToken = redirectUrlQuery.token
          done()
        })
      })
    })
    
    

    
    it('should accept a post and return its id in the Location header', done => {
      const postString = JSON.stringify(objectJson)
      outboxPOST({body: postString, pathParameters: {username: process.env.TEST_USERNAME}, headers: {Authorization: `bearer ${clientToken}`}}, {}, (err, res) => {
        globalObjectId = res.headers.Location
        assert.equal(201, res.statusCode)
        assert.ok(res.headers.Location)
        assert.equal(process.env.API_BASE, res.headers.Location.substr(0, process.env.API_BASE.length))
        setTimeout(foo => {
          done()
        }, 1000)
      })
    })
    
    it('should get a collection containing the recently posted object', done => {
      const event = {headers: {Authorization: `bearer ${clientToken}`}, pathParameters: {username: process.env.TEST_USERNAME}}
      outboxGET(event, {}, (err, res) => {
        const body = JSON.parse(res.body)
        assert.equal(false, !!body.items[0].bcc) //never display bcc
        assert.equal(false, !!body.items[0].bto) //never display bto
        assert.equal(body.totalItems, body.items.length)
        assert.ok(body.totalItems <= 20)
        assert.equal(0, body.items.map(item => item.id).indexOf(globalObjectId))
        done()
      })
    })
    
  })

})
*/
