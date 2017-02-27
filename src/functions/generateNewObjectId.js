'use strict';
const API_BASE = process.env.API_BASE
const getFunctionUrl = require('../functions/getFunctionUrl.js')
const nonce = require('mini-nonce')

module.exports = function generateNewObjectId(username, localObjectId) {
    const id = localObjectId || nonce(18)
    return getFunctionUrl('objectGET', {username: username, objectID: id})
}
