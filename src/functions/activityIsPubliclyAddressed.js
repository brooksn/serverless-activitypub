'use strict'
const traverseJsonLD = require('./traverseJsonLD.js')
const shortDeliveryTypes = ['to', 'bto', 'cc', 'bcc', 'audience']
const publicCollection = 'https://www.w3.org/ns/activitystreams#Public'
const activityPubContext = 'https://www.w3.org/ns/activitystreams'

module.exports = function activityIsPubliclyAddressed(activity, values) {
  const vals = values || traverseJsonLD.getValues(activity, ['to', 'bto', 'cc', 'bcc', 'type', 'audience'], activityPubContext) || {}
  
  for (let i in shortDeliveryTypes) {
    const key = shortDeliveryTypes[i]
    const targetList = Array.isArray(vals[key]) ? vals[key] : [vals[key]].filter(a => a)
    for (let j in targetList) {
      if(targetList[j] === publicCollection) return true
    }
  }
  return false
  
  /*
  let deliveryFields = Object.keys(activity)
  .filter(key => shortDeliveryTypes.indexOf(key) >= 0)
  .filter(key => activity[key])
  .map(key => Array.isArray(activity[key]) ? activity[key] : [activity[key]])

  for (let i in deliveryFields) {
    if (deliveryFields[i].indexOf(publicCollection) >= 0) return true
  }
  return false
  */
}
