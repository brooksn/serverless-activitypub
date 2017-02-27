'use strict';
//const path = require('path')
const makeActor = require('../json/actorTemplate.js')
const DB = require('../db.js')

const notFound = {
  headers: {'Access-Control-Allow-Origin': '*'},
  statusCode: 404
}

const actorResponse = actorObject => {
  return {
    statusCode: 200,
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'},
    body: JSON.stringify(actorObject)
  }
}

module.exports.get = function actorGET(event, context, callback) {
  const db = DB()
  const actorUsername = event.pathParameters.actor_username
  db.getUser(actorUsername)
  .then(user => {
    if (!user) return callback(null, notFound)
    if (user.actorUrl) return callback(null, notFound)
    const actorObject = makeActor(actorUsername, {
      name: user.name || ''
    })
    return callback(null, actorResponse(actorObject))
  }).catch(err => callback(null, notFound))
}
