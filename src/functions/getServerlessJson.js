'use strict';
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')
try {
  var yml = require('../../serverless.yml')
} catch(e) {
  var yml = fs.readFileSync(path.join(__dirname, '../../serverless.yml'), 'utf8')
}
const doc = yaml.safeLoad(yml)

module.exports = function getServerlessJson() {
  return doc
}
