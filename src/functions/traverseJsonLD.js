//const activitystreams = require('../json/contexts/activitystreams.json')

module.exports.prefix = function prefix(object, contextUrl) {
  const trailingOctothorpe = contextUrl.substr(-1) === '#' ? '' : '#'
  const contextUrlTrailed = contextUrl + trailingOctothorpe
  if (!object['@context']) return contextUrlTrailed
  const contexts = Array.isArray(object['@context'])
    ? object['@context'].filter(a => a)
    : [object['@context']].filter(a => a)
  for (let i in contexts) {
    const context = contexts[i]
    if (typeof context === 'string') {
      if (context === contextUrl || context === contextUrlTrailed) {
        return ''
      }
    } else if (typeof context === 'object') {
      for (let j in context) {
        if (context[j] === contextUrl || context[j] === contextUrlTrailed) {
          return `${j}:`
        }
      }
    }
  }
  return contextUrlTrailed
}

module.exports.getKey = function getKey(object, key, contextUrl) {
  return `${module.exports.prefix(object, contextUrl) || ''}${key}`
}

const getValue = function getValue(object, keyPath, contextUrl) {
  const keys = keyPath.split('.')
  let parent = object
  let parentPrefix;
  for (let k in keys) {
    parentPrefix = typeof parentPrefix === 'string' ? parentPrefix : module.exports.prefix(parent, contextUrl)
    const key = `${parentPrefix || ''}${keys[k]}`
    const val = parent[keys[k]] || parent[key]
    if (typeof val === 'undefined' || k >= (keys.length - 1)) return val
    else if (val && typeof val === 'object') parent = val
  }
}

module.exports.getValues = function getValues(object, someKeyPaths, contextUrl) {
  const result = {}
  const keyPaths = Array.isArray(someKeyPaths) ? someKeyPaths : [someKeyPaths]
  for (let i in keyPaths) {
    if (keyPaths[i] && typeof keyPaths[i] === 'string') {
      result[keyPaths[i]] = getValue(object, keyPaths[i], contextUrl)
    }
  }
  return result
}

const setValue = function setValue(object, keyPath, value, contextUrl) {
  const keys = keyPath.split('.')
  let parent = object
  let parentPrefix;
  for (let k in keys) {
    parentPrefix = typeof parentPrefix === 'string' ? parentPrefix : module.exports.prefix(parent, contextUrl)
    const key = parent.hasOwnProperty(keys[k]) ? keys[k] : `${parentPrefix || ''}${keys[k]}`
    if (k >= (keys.length - 1)) {
      if (value == null) delete parent[key]
      else parent[key] = value
      return object;
    } else if (parent[key] && typeof parent[key] === 'object') {

      parent = parent[key]
    } else {
      parent[key] = {}
      parent = parent[key]
    }
  }
  return object
}

module.exports.setValues = function setValues(object, keyPathsValues, contextUrl) {
  for (let keyPath in keyPathsValues) {
    const value = keyPathsValues[keyPath]
    setValue(object, keyPath, value, contextUrl)
  }
  return object
}

/*
const contextUrlExistsAtObjectRoot = (object, url) => {
  const ctx = object['@context']
  if (!ctx) return false
  if (typeof ctx === 'string') {
    if (ctx === url) return true
    else return false
  }
  //it's either an object or an array
  const ctxArr = Array.isArray(ctx) ? ctx : [ctx]
  for (let i in ctxArr) {
    if (typeof ctxArr[i] === 'string' && ctxArr[i] === url) return true
    if (ctxArr[i] && typeof ctxArr[i] === 'object') {
      for (let key in ctxArr[i]) {
        if (ctxArr[i][key] === url) return key
      }
    }
  }
}


const getValue = (object, key, contextUrl, parentCtx) => {
  const ctx = contextUrlExistsAtObjectRoot(object, contextUrl) || parentCtx
  
  if (ctx) {
    const prefix = typeof ctx === 'string' ? ctx + ':' : ''
    const ctxKey = prefix + key
    
    if (typeof object[ctxKey] !== 'undefined') {
      if (object[ctxKey] && typeof object[ctxKey] === 'object' && object[ctxKey]['@value']) {
        return object[ctxKey]['@value']
      } else {
        return object[ctxKey]
      }
    } else if (typeof object[ctxKey + 'Map'] !== 'undefined') {
      return object[ctxKey + 'Map']
    }
  }
  
  const absoluteKeyFragment = (typeof activitystreams['@context'][key] === 'string' ? activitystreams['@context'][key] : activitystreams['@context'][key]['@id'] || '')
  .replace('@type', 'type')//ActivityPub revision E.5
  .replace('@id', 'id')//ActivityPub revision E.5
  
  const absoluteKey = absoluteKeyFragment.replace(/^\w+\:/, prefixPlusColon => {
    const prefix = prefixPlusColon.substr(0, prefixPlusColon.length-1)
    return activitystreams['@context'][prefix]
  })
  
  if (typeof object[absoluteKey] !== 'undefined') {
    if (object[key] && typeof object[key] === 'object' && object[key]['@value']) {
      return object[absoluteKey]['@value']
    } else return object[absoluteKey]
  } else if (typeof object[absoluteKey + 'Map'] !== 'undefined') {
    return object[absoluteKey + 'Map']
  }
}


module.exports.get = function getValuesInJsonLD(object, someKeys, contextUrl) {
  const values = {}
  const keys = Array.isArray(someKeys) ? someKeys : [someKeys].filter(a => a && typeof a === 'string')
  //if the context is anywhere in object['@context']
  //try to read object[key] into values
  
  for (let i in keys) {
    const hierarchy = keys[i].split('.')
    let parent = object
    let parentCtx = null
    for (let j in hierarchy) {
      parentCtx = parentCtx || contextUrlExistsAtObjectRoot(parent, contextUrl)
      parent = getValue(parent, hierarchy[j], contextUrl, parentCtx)
    }
    if (parent) values[keys[i]] = parent
  }
  
  return values
}


module.exports.set = function setValuesInJsonLD(object, keyValPairs, contextUrl) {
  for (let keyName in someKeyValPairs) {
    const keyHierarchy = keyName[i].split('.')
    let parent = object
    let parentCtx = null
    for (let j in keyHierarchy) {
      const shortKey = keyHierarchy[j]
      parentCtx = parentCtx || contextUrlExistsAtObjectRoot(parent, contextUrl)
      const val = getValue(parent, hierarchy[j], contextUrl, parentCtx)
      //parent = getValue(parent, hierarchy[j], contextUrl, parentCtx)
      //val is null, an object, or a primitive
      //if val is null, set parent to 
    }
    
  }
}
*/
