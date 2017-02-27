'use strict';
const jsonld = require('jsonld')

module.exports = function expandJSONLD(object) {
  return new Promise((resolve, reject) => {
    jsonld.expand(object, (err, expanded) => {
      if (err) return reject(err)
      if (Array.isArray(expanded) && expanded.length === 1) return resolve(expanded[0])
      return resolve(expanded)
    })
  })
}
