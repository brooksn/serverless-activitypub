const jsonld = require('./jsonld.js')
const getActivityFromObjectOrActivity = require('./getActivityFromObjectOrActivity.js')
const compactionContext = 'https://www.w3.org/ns/activitystreams'

module.exports = function compactActivityFromObjectOrActivity(objectOrActivityJson) {
  return jsonld.compact(objectOrActivityJson, makeActivityPubContextFromJsonLD(objectOrActivityJson))
  .then(compactObjectOrActivity => {
    const activity = getActivityFromObjectOrActivity(compactObjectOrActivity)
    if (!activity) throw new Error('An activity could not be derived from the object. ')
    return activity
  })
}
