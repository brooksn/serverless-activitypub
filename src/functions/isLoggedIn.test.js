'use strict'
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const USERNAME = process.env.TEST_USERNAME
const JWT_SECRET = process.env.JWT_SECRET
const assert = require('assert')
const jsonwebtoken = require('jsonwebtoken')
const isLoggedIn = require('./isLoggedIn.js')

describe('isLoggedIn',  function() {
//  const clientToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJyb29rcyIsInNjb3BlcyI6WyJwb3N0IiwicmVhZCJdLCJjbGllbnRfaWQiOiJhY21lIiwiaWF0IjoxNDg2NDAxOTI3fQ.qr0VqDTnYfUpRgtndQ0uJL2d4iAMtziLuy1kZx4DAIQ'
const goodTokenPayload = {username: process.env.TEST_USERNAME, scopes: ['post'], client_id: 'acme'}
const badTokenPayload = {username: process.env.TEST_USERNAME, scopes: ['read'], client_id: 'acme'}
const badClientToken = jsonwebtoken.sign(badTokenPayload, process.env.JWT_SECRET, {})
const goodClientToken = jsonwebtoken.sign(goodTokenPayload, process.env.JWT_SECRET, {})
  
  it('should resolve the jwt when username matches the api path username', done => {
    const event = {headers: {Authorization: `bearer ${goodClientToken}`}, pathParameters: {username: USERNAME}}
    isLoggedIn(event, JWT_SECRET)
    .then(jwt => {
      assert.equal(USERNAME, jwt.username)
      assert.equal('acme', jwt.client_id)
      assert.ok(true)
      done()
    })
  })
  
  it('should reject when a token username does not match the api path username', done => {
    const event = {headers: {Authorization: `bearer ${goodClientToken}`}, pathParameters: {username: 'wrong'}}
    isLoggedIn(event, JWT_SECRET)
    .catch(err => {
      assert.equal('This jwt is not valid for username: wrong. ', err)
      done()
    })
  })

})
