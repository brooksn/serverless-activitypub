'use strict'
const assert = require('assert')
const AJV = require('ajv')
const compactionContext = 'https://www.w3.org/ns/activitystreams'
const objectSchema = require('./object.json')
const actorSchema = require('./actor.json')
const schema = 'http://brooks.is/schema/activitystreams/actor'
const coreActorTypes = ['Person', 'Application', 'Group', 'Organization', 'Service']

const ajv = new AJV({v5: true})
ajv.addSchema(objectSchema)
ajv.addSchema(actorSchema)

const actor = {
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

const actorJp = {
  '@context': [ 'https://www.w3.org/ns/activitystreams', { '@language': 'ja' } ],
  id: 'https://kenzoishii.example.com/',
  type: 'Person',
  likes: 'https://kenzoishii.example.com/likes.json',
  followers: 'https://kenzoishii.example.com/followers.json',
  following: 'https://kenzoishii.example.com/following.json',
  icon: 'https://kenzoishii.example.com/image/165987aklre4',
  name: { '@language': 'ja', '@value': '石井健蔵' },
  outbox: 'https://kenzoishii.example.com/feed.json',
  preferredUsername: 'kenzoishii',
  summary: { '@language': 'ja', '@value': 'この方はただの例です' },
  inbox: 'https://kenzoishii.example.com/inbox.json'
}

const actorJpMap = {
  '@context': [ 'https://www.w3.org/ns/activitystreams', { '@language': 'ja' } ],
  id: 'https://kenzoishii.example.com/',
  type: 'Person',
  likes: 'https://kenzoishii.example.com/likes.json',
  followers: 'https://kenzoishii.example.com/followers.json',
  following: 'https://kenzoishii.example.com/following.json',
  icon: 'https://kenzoishii.example.com/image/165987aklre4',
  nameMap: { ja: '石井健蔵' },
  outbox: 'https://kenzoishii.example.com/feed.json',
  preferredUsername: 'kenzoishii',
  summaryMap: { ja: 'この方はただの例です' },
  inbox: 'https://kenzoishii.example.com/inbox.json'
}

describe('actor.json', () => {
  it('should validate the actor object from the ActivityPub spec', () => {
    assert.equal(true, ajv.validate(schema, actor))
  })
  it('should validate the actor object where "name" and "summary" are objects with a language mapping', () => {
    assert.equal(true, ajv.validate(schema, actorJp))
  })
  it('should validate the actor object where "nameMap" and "summaryMap" are objects', () => {
    assert.equal(true, ajv.validate(schema, actorJpMap))
  })
  it('should validate actors where "type" is one of the core Actor Types', () => {
    assert.equal(true, ajv.validate(schema, Object.assign({}, actor, {type: coreActorTypes[1]})))
    assert.equal(true, ajv.validate(schema, Object.assign({}, actor, {type: coreActorTypes[2]})))
    assert.equal(true, ajv.validate(schema, Object.assign({}, actor, {type: coreActorTypes[3]})))
    assert.equal(true, ajv.validate(schema, Object.assign({}, actor, {type: coreActorTypes[4]})))
  })
  it('should not validate an actor where "type" is not one of the core Actor Types', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {type: 'Actor'})))
  })
  it('should not validate an actor where any required field is missing', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {inbox: null})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {outbox: null})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {following: null})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {followers: null})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {likes: null})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {name: null})))
  })
  it('should not validate an actor where any required URL field is not a uri', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {inbox: 'foo'})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {outbox: 'foo'})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {following: 'foo'})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {followers: 'foo'})))
    assert.equal(false, ajv.validate(schema, Object.assign({}, actor, {likes: 'foo'})))
  })
})
