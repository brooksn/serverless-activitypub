'use strict';
const password = require('./functions/password.js')
const userPassword = process.argv[2]
console.log(password.saltAndHashPassword(userPassword))
