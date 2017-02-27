'use strict'
const AJV = require('ajv')
const objectSchema = require('../json/compact-jsonld/activitystreams/object')
const activitySchema = require('../json/compact-jsonld/activitystreams/activity')
const shortActivityTypes = ['Create', 'Update', 'Delete', 'Follow', 'Add', 'Remove', 'Like', 'Block', 'Undo']
const shortDeliveryTypes = ['actor', 'to', 'bto', 'cc', 'bcc', 'audience']
//const activityTypes = shortActivityTypes.map(type => `http://www.w3.org/ns/activitystreams#${type}`)
//const deliveryTypes = shortDeliveryTypes.map(type => `http://www.w3.org/ns/activitystreams#${type}`)

module.exports = function getActivityFromObjectOrActivity(obj) {
  const ajv = new AJV({v5: true})
  ajv.addSchema(objectSchema)
  ajv.addSchema(activitySchema)
  //obj is expected to have been compacted with the activitystreams context
  if (shortActivityTypes.indexOf(obj.type) >= 0){
    const activityIsValid = ajv.validate('http://brooks.is/schema/activitystreams/activity', obj)
    if (activityIsValid !== true)  {
      throw new Error('The activity was not validated by http://brooks.is/schema/activitystreams/activity')
    } else {
      return obj
    }
  } else {
    const activity = { '@context': obj['@context'], type: 'Create', object: obj }
    
    shortDeliveryTypes.forEach(key => {
      if (obj[key]) activity[key] = obj[key]
    })
    
    delete activity.object['@context']
    
    const derivedActivityIsValid = ajv.validate('http://brooks.is/schema/activitystreams/activity', activity)
    
    if (derivedActivityIsValid !== true)  {
      throw new Error('The derived "Create" activity was not validated by http://brooks.is/schema/activitystreams/activity')
    } else {
      return activity
    }
  }
}
