'use strict';
global.fetch = require('node-fetch')
const cheerio = require('cheerio')
const jsonld = require('./jsonld.js')
const makeActivityPubContextFromJsonLD = require('./makeActivityPubContextFromJsonLD.js')
const any = require('./promiseAny.js')
const contentType = require('content-type')
const Ajv = require('ajv')
const objectSchema = require('../json/compact-jsonld/activitystreams/object')
const compactionContext = 'https://www.w3.org/ns/activitystreams'

module.exports = function getJsonLdFromUrl(url, schemaToLoad, schemaName) {
  return fetch(url, {
    headers: {Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'}
  })
  .then(res => {
    const resContentTypeHeader = res.headers.get('content-type')
    let resContentTypeString = Array.isArray(resContentTypeHeader) ? resContentTypeHeader[0] : resContentTypeHeader
    
    if (!resContentTypeString) resContentTypeString = 'text/html'
    const resContentType = contentType.parse(resContentTypeString)
    if (resContentType.type === 'application/json' || resContentType.type === 'application/ld+json') {
      return res.json()
    } else if (resContentType.type === 'text/html') {
      return res.text()
      .then(text => {
        const $ = cheerio.load(text)
        const jsonldDocs = []
        $('[type="application/ld+json"]').each((i, elem) => {
          try {
            jsonldDocs.push(JSON.parse($(elem).text()))
          } catch(e) {}
        })
        if (jsonldDocs.length > 0 ) return Promise.resolve(jsonldDocs)
        return Promise.reject('No JSON-LD documents were found in the HTML page.')
      })
    }
  })
  .then(json => {
    const jsonArray = Array.isArray(json) ? json : [json]
    if (jsonArray.length === 0) return Promise.reject('No JSON-LD documents were found.')
    
    const promiseArray = []
    jsonArray.forEach(doc => promiseArray.push(jsonld.compact(doc, makeActivityPubContextFromJsonLD(doc))))
    return any(promiseArray)
  })
  .then(compactedJsonArray => {
    const ajv = Ajv()
    ajv.addSchema(objectSchema)
    const schemaList = Array.isArray(schemaToLoad) ? schemaToLoad : [schemaToLoad]
    schemaList.filter(a => a).forEach(a => ajv.addSchema(a))
    const sn = schemaName || 'http://brooks.is/schema/activitystreams/object'
    
    for (let i=0; i < compactedJsonArray.length; i++) {
      if (ajv.validate(sn, compactedJsonArray[i])) return Promise.resolve(compactedJsonArray[i])
    }
    return Promise.reject('No json-ld documents were valid according to ' + sn)
    
  })
}
