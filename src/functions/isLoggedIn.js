'use strict'
const querystring = require('querystring')
const jsonwebtoken = require('jsonwebtoken')
const bearerPattern = /^bearer <?([A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*)>?$/i
module.exports = function isLoggedIn(event, JWT_SECRET) {
  return new Promise((resolve, reject) => {
    const username = event.pathParameters.username
    if (typeof username !== 'string' || username.length < 1) return reject('The username was invalid. ')
    let jwtBase64 = null
    const requestBody = typeof event.body === 'string' ? querystring.parse(event.body || '') : (event.body || {})
    const headerAuth = event.headers.authorization || event.headers.Authorization || ''
    const bodyAuth = requestBody.authorization || requestBody.Authorization || ''
    if (bodyAuth.length > 0) jwtBase64 = bodyAuth
    if (headerAuth.length > 0) {
      const jwtMatch = headerAuth.match(bearerPattern, '$1')
      if (Array.isArray(jwtMatch) && jwtMatch[1]) jwtBase64 = jwtMatch[1]
    }
    if (jwtBase64) {
      const decoded = jsonwebtoken.verify(jwtBase64, JWT_SECRET, (err, decoded) => {
        if (err) return reject(err)
        if (!decoded.username || decoded.username !== username) return reject(`This jwt is not valid for username: ${username}. `)
        return resolve(decoded)
      })
    } else return reject('A jwt was not found. ')
  })
}
