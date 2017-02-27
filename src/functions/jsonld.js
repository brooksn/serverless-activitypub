'use strict';
const jsonld = require('jsonld')
const nodeDocumentLoader = jsonld.documentLoaders.node()

const names = {activitystreams: 'activitystreams', schema: 'schema.org'}

const schemaNames = name => {
  if (name.substr(-36) == 'www.w3.org/ns/activitystreams.jsonld') return names.activitystreams
  if (name.substr(-29) == 'www.w3.org/ns/activitystreams') return names.activitystreams
  if (name.substr(-11) == 'schema.org/') return names.schema
  if (name.substr(-10) == 'schema.org') return names.schema
}

function customJSONLDLoader(url, callback) {
  const name = schemaNames(url)
  if (name == names.activitystreams) {
    return callback(null, {
      contextUrl: null, // this is for a context via a link header
      document: require('../json/contexts/activitystreams.json'), // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    })
  } else if (name === names.schema) {
    return callback(null, {
      contextUrl: null,
      document: require('../json/contexts/schema.json'),
      documentUrl: url
    })
  }

  return nodeDocumentLoader(url, callback);
}

jsonld.documentLoader = customJSONLDLoader

module.exports = jsonld.promises
