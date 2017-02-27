'use strict'
const assert = require('assert')
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
const username = process.env.TEST_USERNAME
const mockGetObjectsByUsernameEndpointResponse = require('../../../test/sampleData/getObjectsByUsernameEndpoint-response.json')
const AWSMock = require('aws-sdk-mock')
const DB = require('../../db.js')
const Outbox = require('../../classes/Outbox.js')
const createNote = require('../../../test/sampleData/createNote.json')


describe('getObjectsByUsernameEndpoint', () => {
  let db = null
  let getObjectsByUsernameEndpoint = null
  before(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'query', (params, callback) => callback(null, mockGetObjectsByUsernameEndpointResponse))
    db = new DB()
    getObjectsByUsernameEndpoint = db.getObjectsByUsernameEndpoint
  })
  
  it('should make a query request to the DocumentClient when passed valid parameters', () => {
    return getObjectsByUsernameEndpoint({ username: username, endpoint: 'Outbox' })
    .then(items => {
      const count = items.length
      assert.equal(count, items.filter(a => a.endpoint === 'Outbox').length)
      assert.equal(count, items.filter(a => a.username === process.env.TEST_USERNAME).length)
    })
  })
  
  it('should throw an error if username is missing', done => {
    getObjectsByUsernameEndpoint({ endpoint: 'Inbox' }).
    catch(err => {
      assert.ok(err)
      done()
    })
  })
  
  it('should throw an error if endpoint is missing', done => {
    getObjectsByUsernameEndpoint({ username: process.env.TEST_USERNAME }).
    catch(err => {
      assert.ok(err)
      done()
    })
  })

  after(() => {
    AWSMock.restore('DynamoDB.DocumentClient', 'query')
  })
})
