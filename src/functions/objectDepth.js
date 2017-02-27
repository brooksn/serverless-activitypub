'use strict';
function objectDepth(object, max, num, returnObject, newObject) {
  const allKeys = Object.keys(object) || []
  if (allKeys.length > 0) num++
  if (num > max) return false
  const keys = allKeys.filter(key => {
    if (typeof object[key] === 'object') return true
    else {
      newObject[key] = object[key]
      return false
    }
  })
  for (let k in keys) {
    if (objectDepth(object[keys[k]], max, num) === false) return false
  }
  return true
}

function objectDepthExport(object, max, returnObject) {
  return objectDepth(object, max, 0, returnObject, {})
}

module.exports = objectDepthExport
