global.fetch = require('node-fetch')

module.exports = function externalObjectExistsAtId(object) {
  if (!object.id || typeof object.id !== 'string') return Promise.reject()
  return fetch(object.id, {
    headers: {Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'}
  })
  .then(res => res.text())
  .then(text => {
    if (text === JSON.stringify(object)) return Promise.resolve(object)
    else return Promise.reject(object)
  })
}
