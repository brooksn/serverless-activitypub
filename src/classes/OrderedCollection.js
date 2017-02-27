'use strict';
const Collection = require('../classes/Collection.js')

class OrderedCollection extends Collection {
  constructor(opts) {
    super(opts)
    this.summary = 'Ordered object history'
  }
  get orderedItems() {
    return Array.isArray(this.unorderedItems) ? this.unorderedItems.sort() : []
  }
}

module.exports = OrderedCollection
