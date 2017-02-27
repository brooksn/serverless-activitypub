'use strict';
global.fetch = require('node-fetch')

module.exports = function deliverToCollection(collectionUrl, activityJson) {
  return fetch(collectionUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'},
    body: JSON.stringify(activityJson)
  })
}
