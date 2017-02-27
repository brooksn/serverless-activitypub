const getServerlessJson = require('../../functions/getServerlessJson.js')

module.exports = function getObjectsByUsernameEndpoint(options) {
  const opts = options || {}
  if (!opts.username || !opts.endpoint) {
    return Promise.reject(new Error('the keys "username" and "endpoint" are required'))
  }
  const serverlessJSON = getServerlessJson()
  const documentClient = this.adapter
  const queryParams = {
    TableName: `${serverlessJSON.service}-Posts`,
    IndexName: 'user_endpoints_GSI',
    KeyConditionExpression: 'username = :hkey AND begins_with ( join_endpoint_modified, :sortkeyval )',
    ExpressionAttributeValues: {
      ':hkey': opts.username,
      ':sortkeyval': opts.endpoint
    },
    ScanIndexForward: false,
    Limit: 20
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
