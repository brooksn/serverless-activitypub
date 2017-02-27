'use strict';

const Collection = require('../classes/Collection.js')

class Inbox extends Collection {
  constructor(opts) {
    super(opts)
    this.collectionName = opts.collectionName || 'Inbox'
    this.summary = 'Inbox collection'
    this.endpoint = 'Inbox'
  }
}

module.exports = Inbox
