'use strict';
const DB = require('../db.js')

module.exports.get = function objectGET(event, context, callback) {
  const db = DB()
  const localObjectId = event.pathParameters.objectID
  
  db.getObjectById({localObjectId: localObjectId, InboxOrOutbox: true})
  .then(item => {
    if (Array.isArray(item)) item = item[0]
    if (item && typeof item === 'object') {
      const response = {
        headers: {'Access-Control-Allow-Origin': '*'},
        statusCode: 200,
        body: JSON.stringify(item.object),
      };
      return callback(null, response);
    } else return callback(new Error(item.object))
  }).catch(err => callback(new Error(err)))
}
