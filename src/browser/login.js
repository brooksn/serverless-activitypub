'use strict'
const path = require('path')
const fs = require('fs')
const login_script_string = fs.readFileSync(path.join(__dirname, 'login_script.js'), 'utf8')

module.exports = function login(params) {
  const redirect = params.redirect
  const errHtml = `<h3>${params.err || ''}</h3>`
  return `
    <html>
      <head></head>
      <body>
        ${params.err ? errHtml : ''}
        <form method="POST">
          username: <input type="text" name="username"><br />
          password: <input type="password" name="password"><br />
          <input type="hidden" name="redirect" value="${redirect}">
          <input type="submit" value="Submit">
        </form>
        <script>
          ${login_script_string}
        </script>
      </body>
    </html>
  `
}
