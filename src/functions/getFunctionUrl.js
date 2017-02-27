'use strict'
const url = require('url')
const path = require('path')
const API_BASE = process.env.API_BASE
const getServerlessJson = require('../functions/getServerlessJson.js')
const lambdaFunctions = getServerlessJson().functions

module.exports = function getFunctionUrl(fnName, params) {
  let functionPath =  lambdaFunctions[fnName].events[0].http.path
  Object.keys(params).forEach(param => {
    functionPath = functionPath.replace(`{${param}}`, params[param])
  })
  const u = url.parse(API_BASE)
  u.pathname = path.join(u.pathname, functionPath)
  return url.format(u)
}
