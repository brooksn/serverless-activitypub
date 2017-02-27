'use strict'
const fs = require('fs')
const path = require('path')

const dynamoDBAdapterConstructor = require('./db/dynamoDB.js')
const methodsList = [
  {f: require('./db/dynamodb/getObjectById.js'), n: 'getObjectById'},
  {f: require('./db/dynamodb/getObjects.js'), n: 'getObjects'},
  {f: require('./db/dynamodb/getUser.js'), n: 'getUser'},
  {f: require('./db/dynamodb/insertObjectIntoCollection.js'), n: 'insertObjectIntoCollection'},
  {f: require('./db/dynamodb/getObjectsByUsernameCollection.js'), n: 'getObjectsByUsernameCollection'},
  {f: require('./db/dynamodb/getObjectsByUsernameEndpoint.js'), n: 'getObjectsByUsernameEndpoint'}
]
module.exports = function() {
  const methods = {}
  const dynamoDBAdapter = dynamoDBAdapterConstructor()
  methodsList.forEach(method => {
    if (typeof method.f === 'function') methods[method.n] = method.f.bind({adapter: dynamoDBAdapter})
    else if (method.f && typeof method.f === 'object') {
      methods[method.n] = {}
      for (let key in method.f) {
        if (typeof method.f[key] === 'function') methods[method.n][key] = method.f[key].bind({adapter: dynamoDBAdapter})
      }
    }
  })
  return methods
}

/*
function determineStoreType() {
  const type = 'dynamodb'
  //const adapterPath = path.join(__dirname, 'db', 'dynamoDB.js')
  const dirPath = path.join(__dirname, 'db', type)
  
  //const filenames = fs.readdirSync(dirPath)//ok
  //filenames.forEach(f => console.log(`const ${f.match(/(\w+)\.js/)[1]} = require('./db/dynamodb/${f}')`))
  return {
    type: type,
    files: filenames.filter(fn => fn.substr(-3) === '.js'),
    adapter: dynamoDBAdapter
  }
}
const db = determineStoreType()
const methods = {}

switch (db.type) {
  case 'dynamodb':
    db.files.forEach(fn => {
      const m = require('./db/dynamodb/' + fn)
      const moduleName = fn.substr(0, fn.length-3)
      
      if (typeof m === 'function') methods[moduleName] = m.bind({adapter: db.adapter})
      else if (typeof m === 'object') {
        methods[moduleName] = {}
        for (let key in m) {
          if (typeof m[key] === 'function') methods[moduleName][key] = m[key].bind({adapter: db.adapter})
        }
      }
    })
    break;
  default:
    console.log('db type not specified. ')
    break;
}
*/

//module.exports = methods
