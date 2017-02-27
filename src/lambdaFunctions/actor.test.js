'use strict';
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const AWSMock = require('aws-sdk-mock')
const assert = require('assert')
const AJV = require('ajv')
const objectSchema = require('../json/compact-jsonld/activitystreams/object')
const actorSchema = require('../json/compact-jsonld/activitystreams/actor')
const actorGET = require('../lambdaFunctions/actor.js').get
describe('actorGET', () => {
  const ajv = new AJV()
  ajv.addSchema(objectSchema)
  ajv.addSchema(actorSchema)
  
  before(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      if (params.TableName.substr(-6) === '-Users' && params.Key && params.Key.username) {
        if (params.Key.username === process.env.TEST_USERNAME) {
          return callback(null, {Item: {name: 'John Doe'}})
        } else if (params.Key.username === 'nobody') {
          return callback(null, {})
        } else {
          return callback(null, {Item: {actorUrl: 'https://john.net', name: 'John Doe'}})
        }
      }
      return callback(new Error('the query parameters were not expected.'))
    })
  })
  
  it('should produce a json-ld response containing an actor object', done => {
    actorGET({pathParameters: {actor_username: process.env.TEST_USERNAME}}, {}, (err, res) => {
      const actor = JSON.parse(res.body)
      const isValid = ajv.validate('http://brooks.is/schema/activitystreams/actor', actor)
      assert.equal(res.statusCode, 200)
      assert.equal(true, isValid)
      done()
    })
  })
  
  it('should return a 404 error when the user has a manually specified actor url', done => {
    actorGET({pathParameters: {actor_username: 'nobody'}}, {}, (err, res) => {
      assert.equal(res.statusCode, 404)
      done()
    })
  })
  
  it('should return a 404 error when the user does not exist', done => {
    actorGET({pathParameters: {actor_username: 'nobody'}}, {}, (err, res) => {
      assert.equal(res.statusCode, 404)
      done()
    })
  })
  
  after(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'get')
  })
  
})
