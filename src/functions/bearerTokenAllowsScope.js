module.exports = function bearerTokenAllowsScope(token, scope, user) {
  'use strict'
  return new Promise((resolve, reject) => {
    if (!token) return reject(new Error('bearerTokenAllowsScope requires the token parameter.'))
    if (!Array.isArray(token.scopes)) return reject(new Error('bearerTokenAllowsScope requires the token to have a "scopes" array.'))
    if (!scope) return reject(new Error('bearerTokenAllowsScope requires the scope parameter to be a string or an array of strings.'))
    const scopes = Array.isArray(scope) ? scope : [scope]
    for (let i in scopes) {
      if (token.scopes.indexOf(scopes[i]) < 0) return reject(`The token does not include "${scopes[i]}" in its scope.`)
    }
    return resolve(token)
  })
}
