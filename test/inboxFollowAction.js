'use strict'
const path = require('path')
require('dotenv').config({path: path.join(__dirname, 'test.env')})
const url = require('url')
const assert = require('assert')
const querystring = require('querystring')
const authorizePOST = require('../src/lambdaFunctions/authorize.js').post
const loginPOST = require('../src/lambdaFunctions/login.js').post
const outbox = require('../src/lambdaFunctions/outbox.js')
const outboxPOST = outbox.post
const outboxGET = outbox.get

const followActivityJson = {
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Note",
  "content": "This is a note",
  "published": "2015-02-10T15:04:55Z",
  "to": ["https://example.org/~john/"],
  "bcc": ["https://example.org/~alice/"],
  "cc": ["https://example.com/~erik/followers", "https://www.w3.org/ns/activitystreams#Public"]
}

describe('inbox',  function() {
  describe('inboxGET', () => {
    it('should return a Collection of public posts stripped of blind address fields to unauthenticated clients')
    it('should return a Collection of posts to the authenticated user')
  })
  describe('inboxPOST', () => {
    it('should accept a Create activity and add it to the collection')
    it('should accept a Follow activity and add it to the followers collection ?and to the inbox collection?')
    it('should accept a Like activity and add it to the followers collection ?and to the inbox collection?')
  })
  
})
