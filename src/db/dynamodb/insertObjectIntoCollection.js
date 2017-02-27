const getServerlessJson = require('../../functions/getServerlessJson.js')

module.exports = function insertObjectIntoCollection(options) {
  const opts = options || {}
  if (!opts.username || !opts.object || !opts.actor || !opts.collection || !opts.endpoint || !opts.activityType) {
    return Promise.reject(new Error('the keys "username" "object" "actor" "collection" "endpoint" and "activityType" are required'))
  }
  const serverlessJSON = getServerlessJson()
  const documentClient = this.adapter
  const datePublished = opts.object.published ? new Date(opts.object.published) : new Date()
  const timestamp = datePublished.getTime()

  const putParams = {
    TableName: `${serverlessJSON.service}-Posts`,
    Item: {
      global_object_id: opts.object.id,
      username: opts.username,
      actor_url: opts.actor,
      object_type: opts.object.type,
      activity_type: opts.activityType,
      collection_name: opts.collection,
      join_username_modified: `${opts.username}_${timestamp}`,
      join_collection_modified: `${opts.collection}_${timestamp}`,
      join_endpoint_modified: `${opts.endpoint}_${timestamp}`,
      modified: `${timestamp}`,
      endpoint: opts.endpoint,
      object: opts.object,
      recipients: opts.recipients,
      is_public: !!opts.isPublic
    }
  }
  
  if (opts.additionalItemProps) {
    Object.assign(putParams.Item, opts.additionalItemProps)
  }
  
  return documentClient.put(putParams).promise()
}
