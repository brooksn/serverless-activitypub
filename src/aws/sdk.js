if (process.env.NODE_ENV === 'test') {
  var AWS = require('aws-sdk-mock')
} else {
  var AWS = require('aws-sdk')
}

module.exports = AWS
