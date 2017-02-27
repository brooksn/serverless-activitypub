'use strict'
const path = require('path')
const fs = require('fs')
const oauth_script_string = fs.readFileSync(path.join(__dirname, 'oauth_script.js'), 'utf8')
module.exports = function oauth_authorize(params) {
  const errHtml = `<h3 id="err">${params.err || ''}</h3>`
  return `
    <html>
      <head></head>
      <body>
        <div id="container" style="display:none;">
          ${params.err ? errHtml : ''}
          <p>Hi ${params.username}</p>
          <p>The app with client_id: "${params.client_id}" wants the following access to your account.</p>
          <p>${params.scopes.join(', ')}</p>
          <form method="POST">
            <input type="hidden" name="scope" value="${params.scopes.join(',')}">
            <input type="hidden" name="client_id" value="${params.client_id}">
            <input type="hidden" name="state" value="${params.state || ''}">
            <input type="hidden" name="redirect_uri" value="${params.redirect_uri}">
            <input id="authorization-hidden-input" type="hidden" name="authorization">
            <input name="allow" type="submit" value="Allow"><input name="allow" type="submit" value="Deny">
          </form>
          <button id="logout">log out</button>
        </div>
        <script>
          ${oauth_script_string}
        </script>
      </body>
    </html>
  `
}
