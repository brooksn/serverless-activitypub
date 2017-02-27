'use strict'
const assert = require('assert')
const activityIsPubliclyAddressed = require('./activityIsPubliclyAddressed.js')
const createNote = require('../../test/sampleData/createNote.json')
createNote.audience = 'https://example.com/someObject'
const publicCollection = 'https://www.w3.org/ns/activitystreams#Public'
const recipients = [ 'https://example.org/~john/', 'https://example.org/~joe/', 'https://example.org/~mary/' ]

describe('activityIsPubliclyAddressed', () => {
  
  it('should return "true" when the public collection is in the to field', () => {
    const activity = Object.assign({}, createNote, {'to': publicCollection})
    assert.equal(true, activityIsPubliclyAddressed(activity))
  })
  
  it('should return "true" when the public collection is last in a bto list', () => {
    const activity = Object.assign({}, createNote, {'bto': [].concat(recipients, publicCollection)})
    assert.equal(true, activityIsPubliclyAddressed(activity))
  })
  
  it('should return "true" when the public collection is first in a cc list', () => {
    const activity = Object.assign({}, createNote, {'cc': [].concat(publicCollection, recipients)})
    assert.equal(true, activityIsPubliclyAddressed(activity))
  })
  
  it('should return "true" when the public collection is in the bcc field', () => {
    const activity = Object.assign({}, createNote, {'bcc': publicCollection})
    assert.equal(true, activityIsPubliclyAddressed(activity))
  })
  
  it('should return "true" when the public collection is in the audience field', () => {
    const activity = Object.assign({}, createNote, {'audience': publicCollection})
    assert.equal(true, activityIsPubliclyAddressed(activity))
  })
  
  it('should return "false" when the public collection is in the actor field', () => {
    const activity = Object.assign({}, createNote, {'actor': publicCollection})
    assert.equal(false, activityIsPubliclyAddressed(activity))
  })
  
  it('should return "false" when the public collection is not in any delivery field', () => {
    assert.equal(false, activityIsPubliclyAddressed(createNote))
  })
  
})
