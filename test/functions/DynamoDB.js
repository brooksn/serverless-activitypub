'use strict'
const path = require('path')
require('dotenv').config({path: path.join('test.env')})
if (!process.env.DYNAMODB_LOCAL_PORT) throw new Error('DYNAMODB_LOCAL_PORT is not set. ')
const password = require('../../src/functions/password.js')
const getServerlessJson = require('../../src/functions/getServerlessJson.js')
const serverlessJSON = getServerlessJson()
const service = serverlessJSON.service
const AWS = require('aws-sdk')
const region = 'us-east-1'
const dynamoDBParams = {apiVersion: '2012-08-10', region: region, endpoint: new AWS.Endpoint('http://localhost:' + process.env.DYNAMODB_LOCAL_PORT)}

const spawn = require('child_process').spawn

const wait = ms => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve()
    }, ms)
  })
}


class DynamoDB {
  constructor() {
    process.on('SIGTERM', () => {
      this.db.kill()
    })
    process.on('SIGINT', () => {
      this.db.kill()
    });
  }
  start() {
    const self = this
    return new Promise((resolve, reject) => {
      self.db = spawn('java', ['-jar', 'dynamodb_local/DynamoDBLocal.jar', '-inMemory'])
      self.db.stderr.once('data', data => reject(data.toString('utf8')));
      self.db.stdout.once('data', data => {
        wait(1).then(() => resolve(data.toString('utf8')))
      })
    })
  }
  
  setup() {
    const dynamoDB = new AWS.DynamoDB(dynamoDBParams)
    const docClient = new AWS.DynamoDB.DocumentClient(dynamoDBParams) 
    const postsTable = JSON.parse(JSON.stringify(serverlessJSON.resources.Resources.Posts.Properties)
    .replace('${self:service}', service))
    const usersTable = JSON.parse(JSON.stringify(serverlessJSON.resources.Resources.UsersTable.Properties)
    .replace('${self:service}', service))
    const hashedPassword = password.saltAndHashPassword(process.env.TEST_PASSWORD)
    const userPutParams = {TableName: usersTable.TableName, Item: {username: process.env.TEST_USERNAME, password: hashedPassword}}
    const userGetParams = { TableName: 'serverless-activitypub-Users', Key: { username: 'brooks' } }

    return dynamoDB.createTable(postsTable).promise()
    .then(() => wait(10))
    .then(() => dynamoDB.createTable(usersTable).promise())
    .then(() => wait(10))
    .then(() => docClient.put(userPutParams).promise())
    .catch(err => {
      this.db.kill()
      return Promise.reject(err)
    })
  }
  
  stop() {
    this.db.kill()
  }
}

module.exports = DynamoDB
