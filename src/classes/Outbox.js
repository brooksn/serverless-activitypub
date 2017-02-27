'use strict';
const jsonld = require('../functions/jsonld.js')
const nonce = require('mini-nonce')
const makeActor = require('../json/actorTemplate.js')
const getActivityFromObjectOrActivity = require('../functions/getActivityFromObjectOrActivity.js')
const generateNewObjectId = require('../functions/generateNewObjectId.js')
const traverseJsonLD = require('../functions/traverseJsonLD.js')
const activityPubContext = 'https://www.w3.org/ns/activitystreams'

const Collection = require('../classes/Collection.js')

class Outbox extends Collection {
  constructor(opts) {
    super(opts)
    this.collectionName = opts.collectionName || 'Outbox'
    this.summary = 'Outbox collection'
    this.endpoint = 'Outbox'
  }
  deleteObjectFromCompactActivity(activityJson) {
    
  }
  populateCreateFields(activity) {
    const getActor = !!this.userActorUrl === true ? Promise.resolve({actorUrl: this.userActorUrl}) : this.db.getUser(this.username)
    return getActor.then(user => {
      if (!user) return Promise.reject(`user ${this.username} could not be found.`)
      
      const actorUrl = user.actorUrl || makeActor(this.username, {name: user.name || ''}).id
      //activity[actPrefix + 'actor'] = actorUrl
      //activity.object[objPrefix + 'actor'] = actorUrl
      
      const date = new Date()
      
      const published = date.toISOString()
      //activity[actPrefix + 'published'] = published
      //activity.object[objPrefix + 'published'] = published
      
      //activity.object[objPrefix + 'id'] = generateNewObjectId(this.username)
      
      //delete activity.id //Activities are not retrievable in this server implementation.
      traverseJsonLD.setValues(activity, {
        id: null,
        'object.id': generateNewObjectId(this.username),
        actor: actorUrl,
        'object.actor': actorUrl,
        published: published,
        'object.published': published
      }, activityPubContext)
      return Promise.resolve(activity)
    }).catch(err => {
    })
  }
  update(activity) {
    traverseJsonLD.setValues(activity, {id: null}, activityPubContext)
    const activityFields = traverseJsonLD.getValues(activity, ['object.id', 'type'], activityPubContext)
    const globalObjectId = activityFields['object.id']
    return this.db.getObjectById({username: this.username, globalObjectId: globalObjectId})
    .then(items => {
      const item = Array.isArray(items) ? items[0] : items
      const newObject = traverseJsonLD.getValues(activity, 'object', activityPubContext).object
      Object.assign(item.object, newObject)
      Object.assign(item, {
        actor: item.actor_url,
        isPublic: item.is_public,
        activityType: activityFields.type,
        collection: item.collection_name
      })
      return this.db.insertObjectIntoCollection(item)
    })
    .then(res => activity)
  }
  /*
  mutateNewActivity(activityJson, options) {
    const opts = options || {}
    return new Promise((resolve, reject) => {
      const result = {additionalItemProps: Object.assign({}, opts || {})}
      //Any activity coming to the Outbox endpoint (regardless of which collection to which it is added)
      //is a user-generated activity, and should be assigned an actor and possible an object ID
      //activities are not retrievable at the object endpoint, so activity IDs will be deleted
      
      const date = new Date()
      activityJson.published = date.toISOString()
      activityJson.object.published = date.toISOString()
      if (activityJson.type === 'Create') {
        const localObjectId = opts.localObjectId || nonce(18)
        const globalObjectId = opts.globalObjectId || generateNewObjectId(this.username, localObjectId)
        activityJson.object.id = globalObjectId
        result.additionalItemProps.local_object_id = localObjectId
      }
      
      delete activityJson.id
      
      this.db.getUser(this.username)
      .then(user => {
        if (!user) return reject(`user ${this.username} could not be found.`)
        if (user.actorUrl) {
          activityJson.actor = user.actorUrl
          activityJson.object.actor = user.actorUrl
        } else {
          const actorObject = makeActor(this.username, {name: user.name || ''})
          const actorUrl = actorObject.id
          activityJson.actor = actorUrl
          activityJson.object.actor = actorUrl
        }
        result.activity = activityJson
        return resolve(result)
      })
    })
  }
  */
}

module.exports = Outbox
