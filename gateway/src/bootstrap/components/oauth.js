const AppContext = require('../../util/AppContext')
const OAuthServer = require('express-oauth-server')

module.exports = function (config) {
  return new Promise((resolve, reject) => {
    AppContext.register('OAuthServer', new OAuthServer({
      debug: true,
      model: require('../../service/AuthService') // See https://github.com/oauthjs/node-oauth2-server for specification
    }))
    resolve()
  })
}
