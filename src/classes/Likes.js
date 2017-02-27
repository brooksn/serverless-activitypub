'use strict';

const Collection = require('../classes/Collection.js')

class Likes extends Collection {
  constructor(opts) {
    super(opts)
    this.collectionName = 'Likes'
    this.summary = 'Likes collection'
  }
}

module.exports = Likes
