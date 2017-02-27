'use strict'
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const DynamoDB = require('../../test/functions/DynamoDB.js')
const url = require('url')
const nonce = require('mini-nonce')
const assert = require('assert')
const jsonwebtoken = require('jsonwebtoken')
const querystring = require('querystring')
const authorizePOST = require('./authorize.js').post
const loginPOST = require('./login.js').post

describe('authorize', () => {
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
    .catch(err => {
      console.error(err)
    })
  })
  
  describe('authorize.post', () => {
    it('should redirect requests from logged in users and provide a bearer token', done => {
      const login_qs = querystring.encode({username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD})
      loginPOST({body: login_qs, headers: {}}, {}, (err, res) => {
        const query = querystring.parse(url.parse(res.headers.Location).query)
        const loginJwt = query.jwt
        const state = nonce()
        const auth_qs = querystring.encode({scope:"post,read",client_id:"acme",state:state,redirect_uri:"http://example.com",authorization:loginJwt,allow:"Allow"})
        authorizePOST({body: auth_qs, pathParameters: {username: 'brooks'}, headers: {}}, {}, (err, res) => {
          const redirectUrl = url.parse(res.headers.Location)
          const redirectUrlQuery = querystring.parse(redirectUrl.query)
          assert.equal(302, res.statusCode)
          assert.equal(state, redirectUrlQuery.state)
          assert.ok(redirectUrlQuery.token)
          done()
        })
      })
    })
    
    it('should redirect with an error message for mis-signed login tokens', done => {
      const tokenPayload = {username: process.env.TEST_USERNAME}
      const loginToken = jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET + 'wrong', {})
      const qs = querystring.encode({scope:"post,read",client_id:"acme",state:"foobar",redirect_uri:"http://example.com",authorization:loginToken, allow:"Allow"})
      authorizePOST({body: qs, pathParameters: {username: 'brooks'}, headers: {}}, {}, (err, res) => {
        const redirectUrl = url.parse(res.headers.Location)
        const redirectUrlQuery = querystring.parse(redirectUrl.query)
        assert.equal(false, !!redirectUrlQuery.token)
        assert.equal('JsonWebTokenError: invalid signature', redirectUrlQuery.err)
        done()
      })
    })
    
    it('should redirect with an error message for malformed login tokens', done => {
      const loginJwt = 'foo'
      const qs = querystring.encode({scope:"post,read",client_id:"acme",state:"foobar",redirect_uri:"http://example.com",authorization:loginJwt,allow:"Allow"})
      authorizePOST({body: qs, pathParameters: {username: 'brooks'}, headers: {}}, {}, (err, res) => {
        const redirectUrl = url.parse(res.headers.Location)
        const redirectUrlQuery = querystring.parse(redirectUrl.query)
        assert.equal(false, !!redirectUrlQuery.token)
        assert.equal('JsonWebTokenError: jwt malformed', redirectUrlQuery.err)
        done()
      })
    })
  })
  
  after(() => {
    dynamoDBProcess.stop()
  })
  
})
