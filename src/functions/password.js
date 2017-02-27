'use strict';
const crypto = require('crypto')
const nonce = require('mini-nonce')
const algorithm = 'sha256'

module.exports.passwordMatchesSaltedHash = function passwordMatchesHash(password, salted) {
  const string = salted.split('.')
  const salt = string[0]
  const hash = string[1]
  const newHash = crypto.createHash(algorithm)
  newHash.update(`${salt}.${password}`)
  return newHash.digest('hex') === hash
}

module.exports.saltAndHashPassword = function saltAndHashPassword(password) {
  const salt = nonce(16)
  const hash = crypto.createHash(algorithm)
  hash.update(`${salt}.${password}`)
  return `${salt}.${hash.digest('hex')}`
}
