const getServerlessJson = require('../../functions/getServerlessJson.js')

module.exports = function getObjectsByUsernameCollection(options) {
  const opts = options || {}
  if (!opts.username || !opts.collection) {
    return Promise.reject(new Error('the keys "username" and "collection" are required'))
  }
  const serverlessJSON = getServerlessJson()
  const documentClient = this.adapter
  const queryParams = {
    TableName: `${serverlessJSON.service}-Posts`,
    IndexName: 'user_collection_GSI',
    KeyConditionExpression: 'username = :hkey AND begins_with ( join_collection_modified, :col )',
    ExpressionAttributeValues: {
      ':hkey': opts.username,
      ':col': opts.collection
    },
    ScanIndexForward: false
  }
  if (opts.onlyPublic) {
    queryParams.ExpressionAttributeValues[':pubkey'] = true
    queryParams.FilterExpression = `publicly_addressed = :pubkey`
  }
  return documentClient.query(queryParams).promise()
  .then(response => {
    return Promise.resolve(response.Items)
  })
}
