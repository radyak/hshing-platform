var mongoose = require('mongoose');

var OAuthTokensModel = mongoose.model('OAuthTokens');
var OAuthClientsModel = mongoose.model('OAuthClients');
var OAuthUsersModel = mongoose.model('OAuthUsers');
var OAuthAuthorizazionCodes = mongoose.model('OAuthAuthorizazionCodes');


var AuthService = {


  /**
   * Get access token.
   * required if OAuth2Server#authenticate() is used.
   * 
   * @param   accessToken 	{string} 	The access token to retrieve.
   * 
   * @returns An Object representing the access token and associated data.
   * {
   *      accessToken           {string} 	The access token passed to getAccessToken().
   *      accessTokenExpiresAt  {date} 	  The expiry time of the access token.
   *      client                {object} 	The client associated with the access token.
   *      client.id             {string} 	A unique string identifying the client.
   *      user                  {object} 	The user associated with the access token.
   *      [scope]               {string}  The authorized scope of the access token.
   * }
   */
  getAccessToken: function(bearerToken) {
    // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
    return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
  },


  /**
   * Get refresh token.
   * required if the refresh_token grant is used
   * 
   * TODO: elaborate later
   */
  getRefreshToken: function(refreshToken) {
    return OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
  },


  /**
   * Save token.
   * required for all grant types
   * 
   * @param token 	Object 	The token(s) to be saved.
   *  {
   *      accessToken 	            {string} 	The access token to be saved.
   *      accessTokenExpiresAt 	    {date} 	  The expiry time of the access token.
   *      [refreshToken] 	          {string} 	The refresh token to be saved.
   *      [refreshTokenExpiresAt] 	{date} 	  The expiry time of the refresh token.
   *      [scope] 	                {string} 	The authorized scope of the token(s).
   * }
   * @param client 	{object}  The client associated with the token(s).
   * @param user   	{object} 	The user associated with the token(s).
   * 
   * @returns
   * {
   *    token 	                {object} 	The return value.
   *    accessToken 	          {string} 	The access token passed to saveToken().
   *    accessTokenExpiresAt 	  {date} 	  The expiry time of the access token.
   *    refreshToken 	          {string} 	The refresh token passed to saveToken().
   *    refreshTokenExpiresAt 	{date} 	  The expiry time of the refresh token.
   *    client 	                {object} 	The client associated with the access token.
   *    client.id 	            {string} 	A unique string identifying the client.
   *    user 	                  {object} 	The user associated with the access token
   *    [scope] 	              {string} 	The authorized scope of the access token.
   * }
   */
  saveToken: function(token, client, user) {
    var accessToken = new OAuthTokensModel({
      accessToken: token.accessToken,
      accessTokenExpiresOn: token.accessTokenExpiresOn,
      client : client,
      clientId: client.clientId,
      refreshToken: token.refreshToken,
      refreshTokenExpiresOn: token.refreshTokenExpiresOn,
      user : user,
      userId: user._id,
    });

    // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
    return new Promise( function(resolve,reject){
      accessToken.save(function(err,data){
        if( err ) reject( err );
        else resolve( data );
      }) ;
    }).then(function(saveResult){
      // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
      saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;
      
      // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
      var data = new Object();
      for( var prop in saveResult ) data[prop] = saveResult[prop];
      
      // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
      data.client = data.clientId;
      data.user = data.userId;

      return data;
    });
  },




  /**
   * Get user.
   * required if the password grant
   * 
   * TODO: elaborate later
   */
  getUser: function(username, password) {
    return OAuthUsersModel.findOne({ username: username, password: password }).lean();
  },






  /**
    * Get client.
    * 
    * @param    clientId 	    {string} 	The client id of the client to retrieve.
    * @param    clientSecret 	{string} 	The client secret of the client to retrieve. Can be null.
    * 
    * @returns  An Object representing the client and associated data, or a falsy value if no such client could be found.
    * {
    *     id                      {string} 	        A unique string identifying the client.
    *     grants 	                {Array.<string>} 	Grant types allowed for the client.
    *     [redirectUris] 	        {Array.<string>} 	Redirect URIs allowed for the client. Required for the authorization_code grant.
    *     [accessTokenLifetime] 	{number} 	        Client-specific lifetime of generated access tokens in seconds.
    *     [refreshTokenLifetime] 	{number} 	        Client-specific lifetime of generated refresh tokens in seconds.
    * }
    * 
    */
  getClient: function(clientId, clientSecret) {
    return OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }).lean();
  },






  /**
   * Get Authorization code
   * 
   * Invoked to retrieve an existing authorization code previously saved through Model#saveAuthorizationCode().
   * This model function is required if the authorization_code grant is used.
   * 
   * @param   {string} 	authorizationCode 	The authorization code to retrieve.
   * 
   * @returns An Object representing the authorization code and associated data.
   * {
   *    code 	          {string} 	The authorization code passed to getAuthorizationCode().
   *    expiresAt 	    {date} 	  The expiry time of the authorization code.
   *    client 	        {object} 	The client associated with the authorization code.
   *    client.id 	    {string} 	A unique string identifying the client.
   *    user 	          {object} 	The user associated with the authorization code.
   *    [redirectUri] 	{string} 	The redirect URI of the authorization code.
   *    [scope] 	      {string} 	The authorized scope of the authorization code.
   * }
   */
  getAuthorizationCode: function(authorizationCode){
    return OAuthAuthorizazionCodes.findOne({ authorizationCode: authorizationCode }).lean();
  },

  /**
   * 
   * Save Authorization code
   * 
   * Invoked to save an authorization code.
   * This model function is required if the authorization_code grant is used.
   * 
   * @param {Code} code       The code to be saved
   *        authorizationCode 	String 	The authorization code to be saved.
   *        expiresAt 	Date 	The expiry time of the authorization code.
   *        redirectUri 	String 	The redirect URI associated with the authorization code.
   *        [scope] 	String 	The authorized scope of the authorization code.
   * @param {Client} client   The client associated with the authorization code.
   * @param {User} user       The user associated with the authorization code.
   * 
   * @returns {Code}
   * {
   *    authorizationCode 	String 	The authorization code passed to saveAuthorizationCode().
   *    expiresAt 	Date 	The expiry time of the authorization code.
   *    redirectUri 	String 	The redirect URI associated with the authorization code.
   *    [scope] 	String 	The authorized scope of the authorization code.
   *    client 	Object 	The client associated with the authorization code.
   *    client.id 	String 	A unique string identifying the client.
   *    user 	Object 	The user associated with the authorization code.
   * }
   */
  saveAuthorizationCode: function(code, client, user){
    var authorizationCode = new OAuthAuthorizazionCodes({
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      clientId: client.id,
      userId: user.id
    });

    // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
    return new Promise( function(resolve,reject){
      authorizationCode.save(function(err,data){
        if( err ) reject( err );
        else resolve( data );
      }) ;
    }).then(function(saveResult){
      // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
      saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;
      
      // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
      var data = new Object();
      for( var prop in saveResult ) data[prop] = saveResult[prop];
      
      // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
      data.client = data.clientId;
      data.user = data.userId;

      return data;
    });
  },


  revokeAuthorizationCode: function(code){}

  // Optional:
  // generateAccessToken = function(client, user, scope){};
  // generateRefreshToken = function(client, user, scope){};
  // generateAuthorizationCode = function(client, user, scope){};
  // validateScope = function(user, client, scope){};

  // TODO: document classes

};

module.exports = AuthService;