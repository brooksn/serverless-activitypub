'use strict'
const url = require('url')
const querystring = require('querystring')
module.exports = function redirectTo(redirect, queryObject) {
  const qs = querystring.encode(queryObject)
  const r = url.parse(redirect)
  let del = '?'
  if (r.search && qs.length >= 1) del = '&'
  else if (qs.length < 1) del = ''
  let loc = ''
  if (!r.host) loc = `${r.pathname}${r.search || ''}${del}${qs}`
  else loc = `${r.protocol || 'https:'}${r.slashes === true ? '//' : ''}${r.host}${r.pathname}${r.search || ''}${del}${qs}`
  return {statusCode: 302, body: '', headers: {Location: loc}}
}
