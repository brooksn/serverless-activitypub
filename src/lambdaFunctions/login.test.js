'use strict'
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const DynamoDB = require('../../test/functions/DynamoDB.js')
const url = require('url')
const nonce = require('mini-nonce')
const assert = require('assert')
const jsonwebtoken = require('jsonwebtoken')
const querystring = require('querystring')
const login = require('./login.js')

describe('login', () => {
  let dynamoDBProcess;
  
  before(function(done) {
    this.timeout(6000)
    dynamoDBProcess = new DynamoDB()
    dynamoDBProcess.start()
    .then(res => {
      return dynamoDBProcess.setup()
    })
    .then(res => {
      done()
    })
  })
  
  describe('login.post', () => {
    it('should reply to a correct user/password with a user token in the query of the response url', done => {
      const qs = querystring.encode({username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD})
      login.post({body: qs, headers: {}}, {}, (err, res) => {
        const u = url.parse(res.headers.Location)
        const query = querystring.parse(u.query)
        assert.equal(false, !!u.host)
        assert.ok(query.jwt)
        assert.equal(302, res.statusCode)
        done()
      })
    })
    
    it('should reply to an incorrect user/password with a 200 response and no user token', done => {
      const qs = querystring.encode({username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD + 'wrong'})
      login.post({body: qs, headers: {}}, {}, (err, res) => {
        assert.equal(false, !!res.headers.Location)
        assert.equal(200, res.statusCode)
        done()
      })
    })
    
    it('should reply to a non-existant user with a 200 response and no user token', done => {
      const qs = querystring.encode({username: 'nobody', password: process.env.TEST_PASSWORD + 'wrong'})
      login.post({body: qs, headers: {}}, {}, (err, res) => {
        assert.equal(false, !!res.headers.Location)
        assert.equal(200, res.statusCode)
        done()
      })
    })
  })

  after(() => {
    dynamoDBProcess.stop()
  })
  
})
