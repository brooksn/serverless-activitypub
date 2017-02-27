'use strict';
const assert = require('assert')
const jsonld = require('../src/functions/jsonld.js')
const getActivityFromObjectOrActivity = require('../src/functions/getActivityFromObjectOrActivity.js')
const note = {
  '@context': 'https://www.w3.org/ns/activitystreams',
  type: 'Note',
  cc: [
    'https://example.com/~erik/followers',
    'https://www.w3.org/ns/activitystreams#Public'
  ],
  content: 'This is a note',
  attributedTo: 'https://example.net/~mallory',
  to: 'https://example.org/~john/'
}
const createNote = {
  '@context': 'https://www.w3.org/ns/activitystreams',
  type: 'Create',
  cc: [
  'https://example.com/~erik/followers',
  'https://www.w3.org/ns/activitystreams#Public'
  ],
  object: {
    type: 'Note',
    attributedTo: 'https://example.net/~mallory',
    cc: [
      'https://example.com/~erik/followers',
      'https://www.w3.org/ns/activitystreams#Public'
    ],
    content: 'This is a note',
    to: 'https://example.org/~john/'
  },
  to: 'https://example.org/~john/'
}

describe('getActivityFromObjectOrActivity', () => {
  it('should pass through an Activity', () => {
    return jsonld.compact(createNote, createNote['@context'])
    .then(compacted => {
      const activity = getActivityFromObjectOrActivity(compacted)
      assert.ok(activity)
      assert.deepEqual(activity, createNote)
    })
  })
  it('should nest an object in a Create, copying its delivery parameters to the Activity', () => {
    return jsonld.compact(note, note['@context'])
    .then(compacted => {
      const activity = getActivityFromObjectOrActivity(compacted)
      assert.deepEqual(activity, createNote)
    })
  })
})
