'use strict';
global.fetch = require('node-fetch')
const contentType = require('content-type')
const traverseJsonLD = require('./traverseJsonLD.js')
const activityPubContext = 'https://www.w3.org/ns/activitystreams'

module.exports = function fetchJsonLdFromUrl(url) {
  return fetch(url, {
    headers: {Accept: 'application/ld+json; profile="https://www.w3.org/ns/activitystreams#"'}
  })
  .then(res => {
    const resContentTypeHeaderArray = res.headers.get('content-type')
    let resContentTypeHeader = Array.isArray(resContentTypeHeaderArray) ? resContentTypeHeaderArray[0] : resContentTypeHeaderArray
    
    if (!resContentTypeHeader) resContentTypeHeader = 'text/html'
    const resContentTypeTuple = contentType.parse(resContentTypeHeader)

    if (resContentTypeTuple.type === 'application/json' || resContentTypeTuple.type === 'application/ld+json') {
      return res.json()
    } else if (resContentType.type === 'text/html') {
      return res.text()
      .then(text => {
        const cheerio = require('cheerio')
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
    const jsonArray = Array.isArray(json)
      ? json.filter(a => a && typeof a === 'object')
      : [json].filter(a => a && typeof a === 'object')
      
    if (jsonArray.length === 0) return Promise.reject('No JSON-LD documents were found.')
    
    for (let i in jsonArray) {
      const values = traverseJsonLD.getValues(jsonArray[i], 'id', activityPubContext)
      if (values && values.id === url) return Promise.resolve(jsonArray[i])
    }
    
    return Promise.reject('None of the JSON-LD documents matched the requested object id.')
  })
}
