const getServerlessJson = require('../../functions/getServerlessJson.js')

module.exports = function getObjects(username, collection, opts) {
  const options = opts || {}
  const serverlessJSON = getServerlessJson()
  const documentClient = this.adapter
  const queryParams = {
    TableName: `${serverlessJSON.service}-Posts`,
    IndexName: 'user_collections_GSI',
    KeyConditionExpression: 'username = :hkey',
    ExpressionAttributeValues: {
      ':hkey': username,
      ':pubkey': true
    },
    ScanIndexForward: false,
    Limit: 20
  }
  if (options.FilterExpression) queryParams.FilterExpression = options.FilterExpression
  queryParams.FilterExpression = `publicly_addressed = :pubkey`
  return documentClient.query(queryParams).promise()
  .then(response => {
    return Promise.resolve(response.Items)
  })
}
