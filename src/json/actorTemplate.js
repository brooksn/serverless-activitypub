'use strict';
const getFunctionUrl = require('../functions/getFunctionUrl.js')

const template = {}
const API_BASE = process.env.API_BASE

const p = (collectionName, params) => {
  const functionMap = {
    inbox: 'inboxPOST',
    outbox: 'outboxPOST',
    following: 'followingGET',
    followers: 'followersGET',
    likes: 'likesGET',
    actor: 'actorGET',
    oauthClientAuthorize: 'authorizeGET'
  }
  let fnName = functionMap[collectionName]
  return getFunctionUrl(fnName, params)
}

module.exports = function actorTemplate(username, opts) {
  const options = opts || {}
  const actor = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: p('actor', {actor_username: username}),
    type: 'Person',
    name: opts.name,
    inbox: p('inbox', {username: username}),
    outbox: p('outbox', {username: username}),
    following: p('following', {username: username}),
    followers: p('followers', {username: username}),
    likes: p('likes', {username: username}),
    oauthClientAuthorize: p('oauthClientAuthorize', {username: username})
  }
  if (typeof options.url === 'string') actor.url = options.url
  if (typeof options.icon === 'string') actor.icon = options.icon
  if (Array.isArray(options.icon) && options.icon.filter(a => typeof a === 'string').length > 0) {
    actor.icon = options.icon.filter(a => typeof a === 'string')
  }
  if (typeof options.name === 'string') actor.name = options.name
  if (typeof options.summary === 'string') actor.summary = options.summary
  if (typeof options.preferredUsername === 'string') actor.preferredUsername = options.preferredUsername
  if (typeof options.language === 'string') {
    actor['@context'] = ["https://www.w3.org/ns/activitystreams", {"@language": options.language}]
  }
  return actor
}
