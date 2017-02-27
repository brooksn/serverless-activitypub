'use strict'
const externals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs')
const lambdaDir = __dirname + '/src/lambdaFunctions'
const dynamodbDir = __dirname + '/src/db/dynamodb'
const path = require('path')
const glob = require('glob')
const lambdaFunctionFiles = fs.readdirSync(lambdaDir)
const dynamodbFunctionFiles = fs.readdirSync(dynamodbDir)
const entryPoints = {}
lambdaFunctionFiles.forEach(filePath => {
  const funcName = filePath.match(/^(?!.*\.test\.js$).*\.js$/)
  console.log('funcName: ')
  console.log(funcName)
  if (funcName && funcName[0]) entryPoints[funcName] = path.join(lambdaDir, filePath)
})
console.log(lambdaFunctionFiles)
//entryPoints.db = __dirname + '/src/db/dynamoDB.js'
dynamodbFunctionFiles.forEach(filePath => {
  const funcName = filePath.match(/(\w+)\.js/)[1]
  //entryPoints[funcName] = path.join(lambdaDir, filePath)
})
module.exports = {
  entry: entryPoints,
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
    filename: path.join('src', 'lambdaFunctions', '[name].js')
  },
  target: 'node',
  node: {
    __dirname: true
  },
  externals: [externals()],
  module: {
    loaders: [
      { test:/\.js$/, loader:'babel', exclude: /node_modules/ },
      { test:/\.json$/, loader:'json' },
      { test:/\.yml$/, loader:'raw-loader' }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: __dirname + '/serverless.yml' },
      { from: __dirname + '/src/db/**/*.js' }
    ])
  ]
}
/*
module.exports = {
  entry: entryPoints,
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
}
*/
