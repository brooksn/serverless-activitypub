'use strict';
const getJsonLdFromUrl = require('./getJsonLdFromUrl.js')
const actorSchema = require('../json/compact-jsonld/activitystreams/actor')

module.exports = function discoverInbox(url) {
  return getJsonLdFromUrl(url, actorSchema, actor.id)
}
