var TokenService = require('./TokenService')
var ClientService = require('./ClientService')
var UserService = require('./UserService')
var AuthorizationCodeService = require('./AuthorizationCodeService')

// Optional:
// validateScope = function(user, client, scope){};

var AuthService = {

  getAccessToken: function (bearerToken) {
    return TokenService.getAccessToken(bearerToken)
  },

  getRefreshToken: function (refreshToken) {
    return TokenService.getRefreshToken(refreshToken)
  },

  saveToken: function (token, client, user) {
    return TokenService.saveToken(token, client, user)
  },

  // optional
  generateAccessToken: function (client, user, scope) {
    return TokenService.generateJWT(client, user, scope)
  },

  // optional
  // generateRefreshToken: function(client, user, scope){

  // },

  // optional
  // generateAuthorizationCode: function(client, user, scope){

  // },

  getUser: function (username, password) {
    return UserService.getUserByLogin(username, password)
  },

  getClient: function (clientId, clientSecret) {
    return ClientService.getClient(clientId, clientSecret)
  },

  getAuthorizationCode: function (authorizationCode) {
    return AuthorizationCodeService.getAuthorizationCode(authorizationCode)
  },

  saveAuthorizationCode: function (code, client, user) {
    return AuthorizationCodeService.saveAuthorizationCode(code, client, user)
  },

  revokeAuthorizationCode: function (code) {
    return AuthorizationCodeService.revokeAuthorizationCode(code)
  }

}

module.exports = AuthService
