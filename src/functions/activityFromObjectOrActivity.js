const traverseJsonLD = require('./traverseJsonLD.js')
const activityTypes = ['Create', 'Update', 'Delete', 'Follow', 'Like', 'Block', 'Add', 'Remove', 'Undo']
const targetingFields = ['to', 'bto', 'cc', 'bcc', 'actor', 'audience']
const activityPubContext = 'https://www.w3.org/ns/activitystreams'

// activityFromObjectOrActivity is synchronous, and does not validate
// with JSON schema, nor does it perform JSON-LD compaction

module.exports = function activityFromObjectOrActivity(objectOrActivity) {
  if (!objectOrActivity || typeof objectOrActivity !== 'object') {
    throw new Error('The object or activity could not be parsed.')
  }
  const values = traverseJsonLD.getValues(objectOrActivity, targetingFields.concat('type'), activityPubContext)
  if (values.type && activityTypes.indexOf(values.type) >= 0) {
    return objectOrActivity
  }
  else {
    const activity = {'@context': activityPubContext, type: 'Create', object: objectOrActivity}
    return Object.assign(values, { '@context': activityPubContext, type: 'Create', object: objectOrActivity})
  }
}
