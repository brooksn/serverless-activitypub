'use strict';

const response = {
  headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST,GET,OPTIONS","Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token","Content-Type":"application/json"},
  statusCode: 200
}

module.exports.options = function corsOPTIONS(event, context, callback) {
  return callback(null, response)
}
