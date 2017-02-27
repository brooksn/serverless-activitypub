'use strict';
const AJV = require('ajv')
const jsonld = require('../functions/jsonld.js')
const activityIsPubliclyAddressed = require('../functions/activityIsPubliclyAddressed.js')
const DB = require('../db.js')
const nonce = require('mini-nonce')
const getActivityFromObjectOrActivity = require('../functions/getActivityFromObjectOrActivity.js')
const traverseJsonLD = require('../functions/traverseJsonLD.js')
const compactActivityFromObjectOrActivity = require('../functions/compactActivityFromObjectOrActivity.js')
const generateNewObjectId = require('../functions/generateNewObjectId.js')
const shortActivityTypes = ['Create', 'Update', 'Delete', 'Follow', 'Add', 'Remove', 'Like', 'Block', 'Undo']
const objectSchema = require('../json/compact-jsonld/activitystreams/object')
const activitySchema = require('../json/compact-jsonld/activitystreams/activity')
const activityPubContext = 'https://www.w3.org/ns/activitystreams'

class Collection {
  constructor(opts) {
    const options = opts || {}
    this.db = DB()
    this.unorderedItems = []
    this.username = options.username
    this.endpoint = options.endpoint
    this.private = options.private || false
  }
  updateCollection() {
    return this.db.getObjects(this.username, this.collectionName)
    .then(items => {
      this.unorderedItems = objects
      return Promise.resolve(this)
    })
  }
  get count() {
    if (this.orderedItems && Array.isArray(this.orderedItems)) return this.orderedItems.length
    else if (this.items && Array.isArray(this.items)) return this.items.length
    else return 0
  }
  get items() {
    return Array.isArray(this.unorderedItems) ? this.unorderedItems : []
  }
  delete(activity) {
    const params = {
      username: this.username,
      globalObjectid: activity.object.id || activity.id
    }
    return this.db.removeObjectWithUsernameId(params)
  }
  populateCreateFields(activity) {
    return Promise.resolve(activity)
  }
  create(activity) {
    return this.populateCreateFields(activity).then(mutatedActivity => {
      const fields = ['to', 'bto', 'cc', 'bcc', 'actor', 'audience', 'type', 'object']
      const vals = traverseJsonLD.getValues(mutatedActivity, fields, activityPubContext)
      const isPublic = activityIsPubliclyAddressed(mutatedActivity, vals)
      const params = {
        username: this.username,
        object: vals.object,
        actor: vals.actor,
        activityType: vals.type,
        recipients: [].concat(vals.to, vals.bto, vals.cc, vals.bcc).filter(x => x),
        endpoint: this.endpoint,
        collection: this.collectionName || this.endpoint,
        isPublic: !!isPublic
      }
      return this.db.insertObjectIntoCollection(params)
    })
    .then(res => activity)
  }
  /*
  updateObjectFromCompactActivity(activity) {
    let expandedUpdateActivity = null
    //return externalObjectExistsAtId(activity.object)
    return this.db.getObjectById({username: this.username, globalObjectId: activity.object.id})
    .then(newObject => this.db.getObjectById({username: this.username, globalObjectId: newObject.id}))
    .then(item => {
      const oldObject = item.object && typeof item.object === 'object' ? item.object : {}
      const newObject = Object.assign(oldObject, activity.object)
      expandedUpdateActivity = Object.assign({}, activity, {object: newObject})
      return this.makeInsertObjectParams(expandedUpdateActivity, item)
    })
    .then(params => this.db.insertObjectIntoCollection(params))
    .then(() => expandedUpdateActivity)
  }
  saveObjectFromCompactActivity(compactActivity) {
    return this.makeInsertObjectParams(compactActivity)
    .then(params => this.db.insertObjectIntoCollection(params))
    .then(() => Promise.resolve(compactActivity))
  }
  makeInsertObjectParams(compactActivity, opts) {
    const additionalItemProps = {}
    return this.mutateNewActivity(compactActivity, opts)
    .then(mutationResults => {
      Object.assign(additionalItemProps, mutationResults.additionalItemProps)
      const activity = mutationResults.activity
      
      if (!this.activityIsValid(activity)) {
        return Promise.reject('The activity JSON did not conform to http://brooks.is/schema/activitystreams/activity. ')
      }
      
      const isPublic = activityIsPubliclyAddressed(activity)
      //let dbPromise = null
      if (activity.object && typeof activity.object === 'object' && !Array.isArray(activity.object)) {
        var activityObject = Object.assign({}, activity.object)
        activityObject['@context'] = activity['@context'] || compactionContext
      } else var activityObject = activity.object

      const insertObjectParams = {
        username: this.username,
        object: activityObject,
        actor: activity.actor,
        activityType: activity.type,
        recipients: [].concat(activity.to, activity.bto, activity.cc, activity.bcc).filter(x => x),
        endpoint: this.endpoint,
        collection: this.collectionName || this.endpoint,
        isPublic: isPublic
      }
      
      return insertObjectParams
    })
  }
  saveObjectFromObjectOrActivity(objectOrActivityJson) {
    return compactActivityFromObjectOrActivity(objectOrActivityJson)
    .then(activity => this.saveObjectFromCompactActivity(activity))
  }
  */
  toJSON() {
    const json = {
      '@context': compactionContext,
      summary: this.summary || 'Object history',
      type: this.collectionType || 'Collection',
      totalItems: this.count
    }
    if (this.orderedItems && Array.isArray(this.orderedItems)) json.orderedItems = this.orderedItems
    else if (this.items && Array.isArray(this.items)) json.items = this.items
    if (typeof this.requiredJSONFields === 'object') {
      for (const fieldName in this.requiredJSONFields) json[fieldName] = this.requiredJSONFields[fieldName]
    }
    json.items.forEach(item => {
      delete item.bto
      delete item.bcc
    })
    return JSON.stringify(json)
  }
}

module.exports = Collection
