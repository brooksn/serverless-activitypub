const getServerlessJson = require('../../functions/getServerlessJson.js')
const getFunctionUrl = require('../../functions/getFunctionUrl.js')


module.exports = function getObjectById(options) {
  const opts = options || {}
  if ((!opts.localObjectId && !opts.globalObjectId) ) {
    return Promise.reject('One of "localObjectId" or "globalObjectId" is required')
  }
  const globalObjectId = opts.localObjectId ? getFunctionUrl('objectGET', {objectID: opts.localObjectId}) : opts.globalObjectId
  const serverlessJSON = getServerlessJson()
  const documentClient = this.adapter
  const queryParams = {
    TableName: `${serverlessJSON.service}-Posts`,
    KeyConditionExpression: 'global_object_id = :hkey',
    ExpressionAttributeValues: {
      ':hkey': globalObjectId
    },
    ScanIndexForward: false,
    Limit: 1
  }
  
  if (opts.username) {
    queryParams.KeyConditionExpression = 'global_object_id = :hkey AND begins_with ( join_username_modified, :username )'
    queryParams.ExpressionAttributeValues[':username'] = opts.username
  }
  
  return documentClient.query(queryParams).promise()
  .then(response => {
    if (Array.isArray(response.Items) && response.Items.length > 0) return Promise.resolve(response.Items[0])
    else return Promise.reject(response)
  })
}
