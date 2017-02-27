'use strict';
const url = require('url')
const querystring = require('querystring')
const jsonwebtoken = require('jsonwebtoken')
const redirectTo = require('../functions/redirectTo.js')
const loginTemplate = require('../browser/login.js')
const DB = require('../db.js')
const password = require('../functions/password.js')
const JWT_SECRET = process.env.JWT_SECRET

const loginRequestData = event => {
  const data = {}
  data.requestBody = typeof event.body === 'string' ? querystring.parse(event.body || '') : (event.body || {})
  try {
    const requestBody = JSON.parse(event.body)
    Object.assign(data.requestBody, requestBody)
  } catch(e) {}
  
  data.redirectEncoded = event.queryStringParameters && event.queryStringParameters.u ? event.queryStringParameters.u : '/'
  data.redirect = decodeURIComponent(data.redirectEncoded)
  if (typeof data.requestBody.redirect === 'string' && data.requestBody.redirect.length > 0) data.redirect = data.requestBody.redirect
  data.username = data.requestBody.username || null
  data.password = data.requestBody.password || null
  return data
}

const errorResponse = (redirect, message) => {
  return {
    statusCode: 200,
    body: loginTemplate({redirect: redirect || '/', err: message}),
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/html'}
  }
}

module.exports.get = function loginGET(event, context, callback) {
  const data = loginRequestData(event)
  const queryStringParameters = event.queryStringParameters || {}
  const errQuery = queryStringParameters.err || null
  return callback(null, {
    statusCode: 200,
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/html'},
    body: loginTemplate({redirect: data.redirect, err: errQuery})
  })
}

module.exports.post = function loginPOST(event, context, callback) {
  const db = DB()
  const data = loginRequestData(event)
  
  if (!data.username || !data.password) {
    return callback(null, errorResponse(data.redirect, 'A username and password are required. '))
  }

  db.getUser(data.username)
  .then(user => {
    if (!user || !user.password) {
      return callback(null, errorResponse(data.redirect, 'That username/password combination was not found. '))
    }
    const passwordIsCorrect = password.passwordMatchesSaltedHash(data.password, user.password)
    if (passwordIsCorrect !== true) {
      return callback(null, errorResponse(data.redirect, 'That username/password combination was not found. '))
    }
    const jwt = jsonwebtoken.sign({username: user.username}, JWT_SECRET, {}, (err, token) => {
      if (err) return callback(null, errorResponse(data.redirect, err))
      return callback(null, redirectTo(data.redirect, {jwt: token}))
    })
  })
  .catch(err => callback(null, errorResponse(data.redirect, err)))
}
