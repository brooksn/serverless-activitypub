'use strict'
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const USERNAME = process.env.TEST_USERNAME
const JWT_SECRET = process.env.JWT_SECRET
const assert = require('assert')
const jsonwebtoken = require('jsonwebtoken')
const isLoggedIn = require('./isLoggedIn.js')
const bearerTokenAllowsScope = require('./bearerTokenAllowsScope.js')

describe('bearerTokenAllowsScope',  function() {

  it('should resolve the jwt where a token scope contains the second parameter supplied single scope', done => {
    const tokenPayload = {username: process.env.TEST_USERNAME, scopes: ['post', 'read'], client_id: 'acme'}
    const clientToken = jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {})
    const event = {headers: {Authorization: `bearer ${clientToken}`}, pathParameters: {username: USERNAME}}
    isLoggedIn(event, JWT_SECRET).then(jwt => bearerTokenAllowsScope(jwt, 'read'))
    .then(jwt => {
      assert.equal(true, jwt.scopes.indexOf('read') >= 0)
      done()
    })
  })
  
  it('should resolve the jwt where a token scope contains all of the second parameter supplied scope', done => {
    const tokenPayload = {username: process.env.TEST_USERNAME, scopes: ['post', 'read'], client_id: 'acme'}
    const clientToken = jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {})
    const event = {headers: {Authorization: `bearer ${clientToken}`}, pathParameters: {username: USERNAME}}
    isLoggedIn(event, JWT_SECRET).then(jwt => bearerTokenAllowsScope(jwt, ['read', 'post']))
    .then(jwt => {
      assert.equal(true, jwt.scopes.indexOf('read') >= 0)
      assert.equal(true, jwt.scopes.indexOf('post') >= 0)
      done()
    })
  })
  
  it('should resolve the jwt where a token scope does not contain all of the second parameter supplied scope', done => {
    const tokenPayload = {username: process.env.TEST_USERNAME, scopes: ['post', 'read'], client_id: 'acme'}
    const clientToken = jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {})
    const event = {headers: {Authorization: `bearer ${clientToken}`}, pathParameters: {username: USERNAME}}
    isLoggedIn(event, JWT_SECRET).then(jwt => bearerTokenAllowsScope(jwt, ['read', 'post', 'admin']))
    .catch(err => {
      assert.equal('The token does not include "admin" in its scope.', err)
      done()
    })
  })

})
