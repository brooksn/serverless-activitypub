'use strict';
const JWT_SECRET = process.env.JWT_SECRET
const isLoggedIn = require('../functions/isLoggedIn.js')
const bearerTokenAllowsScope = require('../functions/bearerTokenAllowsScope.js')
//const sendNotificationsToQueue = require('../functions/sendNotificationsToQueue.js')
const activityFromObjectOrActivity = require('../functions/activityFromObjectOrActivity.js')
const traverseJsonLD = require('../functions/traverseJsonLD.js')
const Collection = require('../classes/Collection.js')
const Outbox = require('../classes/Outbox.js')
const httpError = require('../functions/httpError.js')
const activityPubContext = 'https://www.w3.org/ns/activitystreams'

const createdResponse = activity => ({ statusCode: 201, headers: { 'Access-Control-Allow-Origin': '*', Location: activity.object.id }})

const collectionResponse = collectionString => {
  return { statusCode: 200, body: collectionString, headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'}}
}

module.exports.get = function outboxGET(event, context, callback) {
  const username = event.pathParameters.username
  return isLoggedIn(event, JWT_SECRET)
  .then(jwt => bearerTokenAllowsScope(jwt, 'read'))
  .then(jwt => {
    const outbox = new Outbox({username: username})
    return outbox.updateCollection()
  })
  .then(outbox => {
    const collectionString = outbox.toJSON()
    return callback(null, collectionResponse(collectionString))
  })
  .catch(err => callback(null, httpError(err)))
}


module.exports.post = function outboxPOST(event, context, callback) {
  const username = event.pathParameters.username
  return isLoggedIn(event, JWT_SECRET)
  .then(jwt => bearerTokenAllowsScope(jwt, 'post'))
  .then(jwt => {
    try {
      const body = JSON.parse(event.body)
      if (body && typeof body === 'object') return body
      throw new Error('The request body could not be parsed as JSON.')
    } catch(err) { return Promise.reject(err); }
  })
  //.then(body => compactActivityFromObjectOrActivity(body))
  .then(body => activityFromObjectOrActivity(body))
  .then(activity => {
    const activityValues = traverseJsonLD.getValues(activity, ['type', 'target'], activityPubContext)
    const activityType = activityValues.type
    const activityTarget = activityValues.target
    switch (activityType) {
      case 'Create':
        return new Outbox({username: username}).create(activity)
        break;
      case 'Update': //The user can delete an object by global_object_id from her own outbox
        return new Outbox({username: username}).update(activity)
        break;
      case 'Add':
        return new Outbox({username: username, collection: activityTarget}).create(activity)
        break;
      case 'Delete': //The user can delete an object by global_object_id from her own outbox
      case 'Remove':
        return new Outbox({username: username}).delete(activity)
        break;
      case 'Like':
        return new Outbox({username: username, collection: 'Likes'}).create(activity)
        break;
      case 'Follow':
        return new Outbox({username: username, collection: 'Following'}).create(activity)
        break;
      case 'Block':
        return new Outbox({username: username, collection: 'Blocked'}).create(activity)
        break;
      case 'Add':
        return new Outbox({username: username, collection: activityTarget}).create(activity)
        break;
      case 'Undo':
      default:
        return Promise.reject('The supplied activity type is not supported.')
    }
  })
  .then(activity => {
    return callback(null, createdResponse(activity))
  })
  .catch(err => {
    callback(null, httpError(err))
  })
}
