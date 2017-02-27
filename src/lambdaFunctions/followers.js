'use strict';
const JWT_SECRET = process.env.JWT_SECRET
const isLoggedIn = require('../functions/isLoggedIn.js')
const bearerTokenAllowsScope = require('../functions/bearerTokenAllowsScope.js')
const Collection = require('../classes/Collection.js')

const collectionResponse = collectionString => {
  return {
    statusCode: 200,
    body: collectionString,
    headers: {'Access-Control-Allow-Origin': '*','Content-Type': 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'}
  }
}

module.exports.get = function followersGET(event, context, callback) {
  const username = event.pathParameters.username
  return isLoggedIn(event, JWT_SECRET)
  .catch(notLoggedIn => {
    const followers = new Collection({username: username, collection: 'Followers'})
    followers.updateCollection()
    .then(() => callback(null, collectionResponse(followers.toJSON())))
  })
  .then(jwt => bearerTokenAllowsScope(jwt, 'read'))
  .then(jwt => {
    const followers = new Collection({username: username, collection: 'Followers', private: true})
    return followers.updateCollection()
    .then(() => callback(null, collectionResponse(followers.toJSON())))
  })
}
