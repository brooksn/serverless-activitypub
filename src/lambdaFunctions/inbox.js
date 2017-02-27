'use strict';
const Inbox = require('../classes/Inbox.js')
const eq = require('lodash/eq')
const fetchJsonLdFromUrl = require('../functions/fetchJsonLdFromUrl.js')
const traverseJsonLD = require('../functions/traverseJsonLD.js')
const httpError = require('../functions/httpError.js')

const inboxResponse = res => {
  return {}
}

module.exports.get = function inboxGET(event, context, callback) {
  const username = event.pathParameters.username
  const inbox = new Inbox({username: username})
  return inbox.updateCollection()
  .then(() => {
    const collectionString = inbox.toJSON()
    return callback(null, collectionResponse(collectionString))
  })
  .catch(err => callback(null, httpError(err)))
}

module.exports.post = function inboxPOST(event, context, callback) {
  const username = event.pathParameters.username
  try {
    var body = JSON.parse(event.body)
    if (!body || typeof body === 'object') throw new Error('The request body could not be parsed as JSON.')
    var activity = activityFromObjectOrActivity(body)
  } catch(err) {
    return callback(null, httpError(err))
  }
  return fetchJsonLdFromUrl(activity.object.id)
  .then(object => {
    switch (activity.type) {
      case 'Update':
        const updatedObject = Object.assign({}, json, activity.object)
        if (eq(object, updatedObject)) return Promise.resolve(Object.assign(activity, {object: updatedObject}))
        else return Promise.reject('The activity could not be verified at its source.')
        break;
      case 'Add':
      case 'Create':
      case 'Follow':
        if (eq(object, activity.object)) return Promise.resolve(activity)
        else return Promise.reject('The activity could not be verified at its source.')
        break;
      case 'Remove':
      case 'Delete':
        if (object.type === 'Tombstone') return Promise.resolve(activity)
        else return Promise.reject('The activity could not be verified at its source.')
        break;
      default:
        return Promise.reject('The activity type is not supported.')
    }
  })
  .then(activity => {
    switch (activity.type) {
      case 'Create':
      case 'Update':
        return new Inbox({username: username}).create(activity)
        break;
      case 'Delete':
        return new Inbox({username: username}).delete(activity)
        break;
      case 'Follow':
        return new Inbox({username: username, collection: 'Following'}).create(activity)
        break;
      case 'Like':
        return new Inbox({username: username, collection: 'Likes'}).create(activity)
        break;
      case 'Add':
        return new Outbox({username: username, collection: activity.target}).create(activity)
        break;
      case 'Remove':
        return new Inbox({username: username, collection: activity.target}).delete(activity)
        break;
      case 'Block':
      case 'Undo':
      default:
        return Promise.reject('The supplied activity type is not supported.')
    }
  })
  .then(res => {
    return callback(null, inboxResponse(res))
  })
  .catch(err => callback(null, httpError(err)))
}
