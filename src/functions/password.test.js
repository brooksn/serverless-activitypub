'use strict';
const assert = require('assert')
const password = require('./password.js')
const userPassword = 'foobar'

describe('passwordMatchesSaltedHash', () => {
  const hashedPassword = password.saltAndHashPassword(userPassword)
  const altHashedPassword = password.saltAndHashPassword(userPassword)
  password.passwordMatchesSaltedHash(userPassword, hashedPassword)
  
  it('should only match correct user passwords to a stored hash', () => {
    assert.equal(password.passwordMatchesSaltedHash(userPassword, hashedPassword), true)
  })
  
  it('should not match incorrect user passwords to a stored hash', () => {
    assert.equal(password.passwordMatchesSaltedHash('FooBar', hashedPassword), false)
  })
  
  it('should not produce the same hash from the same password', () => {
    assert.notEqual(hashedPassword, altHashedPassword)
  })
  
})