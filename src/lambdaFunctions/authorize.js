'use strict'
const url = require('url')
const querystring = require('querystring')
const jsonwebtoken = require('jsonwebtoken')
const redirectTo = require('../functions/redirectTo.js')
const isLoggedIn = require('../functions/isLoggedIn.js')
const authTemplate = require('../browser/oauth_authorize.js')
const JWT_SECRET = process.env.JWT_SECRET
const missing = 'Missing one of client_id, scope, or redirect_uri in query. '

const authTemplateResponse = params => {
  return {
    statusCode: 200,
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'text/html'},
    body: authTemplate(params)
  }
}

module.exports.get = function authorizeGET(event, context, callback) {
  const params = Object.assign({username: event.pathParameters.username}, event.queryStringParameters)
  params.scopes = params.scope.split(',') || []
  if (params.err) return callback(null, authTemplateResponse(params))
  if (params.scopes.length < 1 || !params.client_id || !params.redirect_uri) {
    return callback(null, redirectTo(params.redirect_uri || '', {err: missing}))
  }
  params.scopes = params.scope.split(',')
  return callback(null, authTemplateResponse(params))
}

module.exports.post = function authorizePOST(event, context, callback) {
  var requestBody = typeof event.body === 'string' ? querystring.parse(event.body || '') : (event.body || {})
  //compatabilty with dherault/serverless-offline #177
  try { requestBody = JSON.parse(event.body) } catch(e) {}

  const client_id = requestBody.client_id || null
  const scopes = (requestBody.scope || '').split(',') || []
  const redirect_uri = requestBody.redirect_uri || ''
  const redirectUrl = url.parse(redirect_uri).hostname || null
  const state = requestBody.state || ''
  if (!client_id || scopes.length < 1 || !redirectUrl) return callback(null, redirectTo(redirect_uri || '', {err: missing}))
  return isLoggedIn(event, JWT_SECRET)
  .then(jwt => {
    jsonwebtoken.sign({username: jwt.username, scopes: scopes, client_id: client_id}, JWT_SECRET, {}, (err, token) => {
      if (err) return callback(null, redirectTo(redirect_uri, {err: err}))
      return callback(null, redirectTo(redirect_uri, {access_token: token, token: token, state: state}))
    })
  })
  .catch(err => {
    delete requestBody.authorize
    const q = Object.assign(requestBody, {err: typeof err === 'string' ? err : `${err}`})
    return callback(null, redirectTo(redirect_uri || '../login', q))
  })
}
