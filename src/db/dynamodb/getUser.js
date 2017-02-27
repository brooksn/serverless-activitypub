'use strict';
const getServerlessJson = require('../../functions/getServerlessJson.js')

module.exports = function getUser(username) {
  const serverlessJSON = getServerlessJson()
  const documentClient = this.adapter
  
  const params = {
    TableName: `${serverlessJSON.service}-Users`,
    Key: {
      username: username
    }
  }

  return documentClient.get(params).promise()
  .then(res => {
    if (res.Item) return Promise.resolve(res.Item)
    else return Promise.resolve(null)
  })

}
