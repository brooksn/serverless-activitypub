'use strict'
const assert = require('assert')
const fetchMock = require('fetch-mock')
const getJsonLdFromUrl = require('./getJsonLdFromUrl.js')
const htmlWithActorObjectInline = require('../../test/sampleData/htmlWithActorObjectInline.js')
const createNote = require('../../test/sampleData/createNote.json')
const actorSchema = require('../json/compact-jsonld/activitystreams/actor.json')
const ct = 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'
const person = {
  "@context": ["https://www.w3.org/ns/activitystreams",
               {"@language": "ja"}],
  "type": "Person",
  "id": "https://kenzoishii.example.com/",
  "following": "https://kenzoishii.example.com/following.json",
  "followers": "https://kenzoishii.example.com/followers.json",
  "likes": "https://kenzoishii.example.com/likes.json",
  "inbox": "https://kenzoishii.example.com/inbox.json",
  "outbox": "https://kenzoishii.example.com/feed.json",
  "preferredUsername": "kenzoishii",
  "name": "石井健蔵",
  "summary": "この方はただの例です",
  "icon": [
    "https://kenzoishii.example.com/image/165987aklre4"
  ]
}
const x = 'https://example.com/john.json'
describe('getJsonLdFromUrl', () => {
  
  before(() => {
    //fetchMock.mock(, person)
    fetchMock.mock('https://example.com/john.json', {
      status: 299,
      body: person,
      headers: {'Content-Type': ct}
    })
    fetchMock.mock('https://example.com/john.html', htmlWithActorObjectInline)
  })
  
  it('should get an activitypub actor from a GET request', done => {
    getJsonLdFromUrl('https://example.com/john.json', actorSchema, actorSchema.id)
    .then(res => {
      assert.equal(person.preferredUsername, res.preferredUsername)
      assert.equal(person.id, res.id)
      assert.equal(person.likes, res.likes)
      done()
    })
  })
  
  it('should get an activitypub actor from an html page', done => {
    getJsonLdFromUrl('https://example.com/john.html', actorSchema, actorSchema.id)
    .then(res => {
      assert.ok(true)
      done()
    })
  })
  
  it('should get an activitypub object from a GET request')
  
  it('should get an activitypub object from an html page')
  
  after(() => {
    fetchMock.restore()
  })

})
