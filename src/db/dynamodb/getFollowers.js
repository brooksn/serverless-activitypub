const getServerlessJson = require('../../functions/getServerlessJson.js')

module.exports = function getFollowers(username) {
  const serverlessJSON = getServerlessJson()
  const db = this.adapter

 const params = {
  TableName: `${serverlessJSON.service}-Posts`,
  IndexName: 'user_collections_GSI',
  KeyConditionExpression: 'username = :hkey AND begins_with ( join_endpoint_modified, :sortkeyval )',
  ExpressionAttributeValues: {
    ':hkey': opts.username,
    ':sortkeyval': 'Followers'
  },
  ScanIndexForward: false
}
 return db.query(params).promise()
 .then(res => {
   if (res.Items && Array.isArray(res.Items) && res.Items.length === 1) {
     return Promise.resolve(res.Items[0])
   } else return Promise.reject(`${username} was not found. `)
 })
}
