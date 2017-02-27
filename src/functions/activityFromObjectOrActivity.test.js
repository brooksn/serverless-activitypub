'use strict'
const assert = require('assert')
const activityFromObjectOrActivity = require('./activityFromObjectOrActivity.js')
const createNote = require('../../test/sampleData/createNote.json')
const updateNote = require('../../test/sampleData/updateNote.json')
const publicCollection = 'https://www.w3.org/ns/activitystreams#Public'

const note = {
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Note",
  "content": "This is a note",
  "published": "2015-02-10T15:04:55Z",
  "to": ["https://example.org/~john/"],
  "cc": ["https://example.com/~erik/followers", "https://www.w3.org/ns/activitystreams#Public"]
}

describe('activityFromObjectOrActivity', () => {
  
  it('should pass through a Create activity', () => {
    assert.equal(createNote, activityFromObjectOrActivity(createNote))
  })
  
  it('should pass through an Update activity', () => {
    assert.equal(updateNote, activityFromObjectOrActivity(updateNote))
  })
  
  it('should wrap a Note object in a Create activity', () => {
    const activity = activityFromObjectOrActivity(note)
    assert.equal(activity.type, 'Create')
    assert.equal(activity.object.type, 'Note')
    assert.equal(1, activity.to.length)
    assert.equal(2, activity.cc.length)
    assert.equal(activity['@context'], 'https://www.w3.org/ns/activitystreams')
  })
  
})
