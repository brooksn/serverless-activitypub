'use strict'
const assert = require('assert')
const traverseJsonLD = require('./traverseJsonLD.js')
const ctx = 'https://www.w3.org/ns/activitystreams'

const createNote = require('../../test/sampleData/createNote.json')

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

const actorW3 = {
  "@context": {"w3streams": "https://www.w3.org/ns/activitystreams", "@language": "ja"},
  "w3streams:type": "Person",
  "w3streams:id": "https://kenzoishii.example.com/",
  "w3streams:following": "https://kenzoishii.example.com/following.json",
  "w3streams:followers": "https://kenzoishii.example.com/followers.json",
  "w3streams:likes": "https://kenzoishii.example.com/likes.json",
  "w3streams:inbox": "https://kenzoishii.example.com/inbox.json",
  "w3streams:outbox": "https://kenzoishii.example.com/feed.json",
  "w3streams:preferredUsername": "kenzoishii",
  "w3streams:name": "石井健蔵",
  "w3streams:summary": "この方はただの例です",
  "w3streams:icon": [
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

const actorJpMapW3 = {
  "@context": {"w3streams": "https://www.w3.org/ns/activitystreams", "@language": "ja"},
  "w3streams:type": "Person",
  "w3streams:id": "https://kenzoishii.example.com/",
  "w3streams:following": "https://kenzoishii.example.com/following.json",
  "w3streams:followers": "https://kenzoishii.example.com/followers.json",
  "w3streams:likes": "https://kenzoishii.example.com/likes.json",
  "w3streams:inbox": "https://kenzoishii.example.com/inbox.json",
  "w3streams:outbox": "https://kenzoishii.example.com/feed.json",
  "w3streams:preferredUsername": "kenzoishii",
  "w3streams:nameMap": { ja: '石井健蔵' },
  "w3streams:summaryMap": { ja: 'この方はただの例です' },
  "w3streams:icon": [
    "https://kenzoishii.example.com/image/165987aklre4"
  ]
}

const actorJpAbsolute = {
  "@context": {"w3streams": "https://www.w3.org/ns/activitystreams", "@language": "ja"},
  "http://www.w3.org/ns/activitystreams#type": "Person",
  "http://www.w3.org/ns/activitystreams#id": "https://kenzoishii.example.com/",
  "http://www.w3.org/ns/activitystreams#following": "https://kenzoishii.example.com/following.json",
  "http://www.w3.org/ns/activitystreams#followers": "https://kenzoishii.example.com/followers.json",
  "http://www.w3.org/ns/activitystreams#likes": "https://kenzoishii.example.com/likes.json",
  "http://www.w3.org/ns/activitystreams#inbox": "https://kenzoishii.example.com/inbox.json",
  "http://www.w3.org/ns/activitystreams#outbox": "https://kenzoishii.example.com/feed.json",
  "http://www.w3.org/ns/activitystreams#preferredUsername": "kenzoishii",
  "http://www.w3.org/ns/activitystreams#nameMap": { ja: '石井健蔵' },
  "http://www.w3.org/ns/activitystreams#summaryMap": { ja: 'この方はただの例です' },
  "http://www.w3.org/ns/activitystreams#icon": [
    "https://kenzoishii.example.com/image/165987aklre4"
  ]
}

describe('traverseJsonLD', () => {

  describe('traverseJsonLD.getValues', () => {
    
    it('should get the "id" of a Create activity', () => {
      const res = traverseJsonLD.getValues(createNote, 'id', ctx)
      assert.ok(res)
      assert.equal(1, Object.keys(res).length)
      assert.equal(createNote.id, res.id)
    })
    
    it('should get the value of the "name" key from a compact actor object', () => {
      const res = traverseJsonLD.getValues(actor, 'name', ctx)
      assert.ok(res)
      assert.equal(1, Object.keys(res).length)
      assert.equal('石井健蔵', res.name)
    })
    
    it('should get the values of the "inbox" and "outbox" keys from a compact actor object', () => {
      const res = traverseJsonLD.getValues(actor, ['inbox', 'outbox'], ctx)
      assert.ok(res)
      assert.equal(2, Object.keys(res).length)
      assert.equal('https://kenzoishii.example.com/inbox.json', res.inbox)
      assert.equal('https://kenzoishii.example.com/feed.json', res.outbox)
    })
    
    it('should get the values of the "w3streams:inbox" and "w3streams:outbox" keys from a compact actor object when "inbox" and "outbox" are requested', () => {
      const res = traverseJsonLD.getValues(actorW3, ['inbox', 'outbox'], ctx)
      assert.ok(res)
      assert.equal(2, Object.keys(res).length)
      assert.equal('https://kenzoishii.example.com/inbox.json', res.inbox)
      assert.equal('https://kenzoishii.example.com/feed.json', res.outbox)
    })
    
    it('should get the japanese values of the "name" and "summary" keys from a compact actor object')
    
    it('should get all the language values of the "nameMap" and "summaryMap" keys of a compact actor when "name" and "summary" are requested')
    
    it('should get all the language values of the "w3streams:nameMap" and "w3streams:summaryMap" keys of a compact actor when "name" and "summary" are requested')
    
    it('should get all the language values of the "http://www.w3.org/ns/activitystreams#nameMap" and "http://www.w3.org/ns/activitystreams#summaryMap" keys of a compact actor when "name" and "summary" are requested')
    
    it('should get a nested field from a Create activity')
    
  })
  
  describe('traverseJsonLD.setValues', () => {
    it('should set the value of the "name" key from a compact actor object', () => {
      const _actor = Object.assign({}, actor)
      traverseJsonLD.setValues(_actor, {name: 'John'}, ctx)
      assert.equal('John', _actor.name)
    })
    
    it('should set nested undefined properties of an actor object', () => {
      const _actor = Object.assign({}, actor)
      traverseJsonLD.setValues(_actor, {'foo.bar': 'baz'}, ctx)
      assert.equal('baz', _actor.foo.bar)
    })
    
    it('should delete a property when the value is null', () => {
      const _actor = Object.assign({}, actor)
      traverseJsonLD.setValues(_actor, {id: null}, ctx)
      assert.equal('undefined', typeof _actor.id)
    })
  })
  
})
