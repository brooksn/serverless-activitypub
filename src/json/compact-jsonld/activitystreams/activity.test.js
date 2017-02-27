'use strict'
const assert = require('assert')
const AJV = require('ajv')
//const jsonld = require('./src/functions/jsonld.js')
const compactionContext = 'https://www.w3.org/ns/activitystreams'
const objectSchema = require('./object.json')
const activitySchema = require('./activity.json')
const schema = 'http://brooks.is/schema/activitystreams/activity'

const deleteActivity = {
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Delete",
  "object": "https://example.org/~alice/note/23"
}

const updateActivity = {
  "@context": "https://www.w3.org/ns/activitystreams",
  "type": "Update",
  "actor": "https://example.net/~mallory",
  "to": ["https://hatchat.example/sarah/",
         "https://example.com/peeps/john/"],
  "object": {
    "@context": {"@language": "en"},
    "id": "https://example.org/~alice/note/23",
    "type": "Note",
    "author": "https://example.org/~alice",
    "content": "I'm a goat"
  }
}

const ajv = new AJV({v5: true})
ajv.addSchema(objectSchema)
ajv.addSchema(activitySchema)

describe('actor.json', () => {
  it('should validate Delete activities where "object" is a url', () => {
    assert.equal(true, ajv.validate(schema, deleteActivity))
  })
  it('should not validate Delete activities where "object" is an object', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, deleteActivity, {object: updateActivity.object})))
  })
  it('should not validate Delete activities where "object" is a non-url string', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, deleteActivity, {object: 'foo'})))
  })
  it('should validate Update activities where "object" is an object with an "id" that is a uri', () => {
    assert.equal(true, ajv.validate(schema, updateActivity))
  })
  it('should not validate Update activities where "object" is not an object', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, updateActivity, {object: 'http://example.com'})))
  })
  it('should not validate Update activities where "object.id" is not a uri', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, updateActivity, {object: {id: 'foo'}})))
  })
  it('should not validate an activity of type "Arbitrary"', () => {
    assert.equal(false, ajv.validate(schema, Object.assign({}, updateActivity, {type: 'Arbitrary'})))
  })
  it('should not validate an Add activity that is missing a "target" field')
  it('should not validate a Remove activity that is missing a "target" field')
})
