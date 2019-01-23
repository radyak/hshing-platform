var mongoose = require('mongoose');

var OAuthClientsModel = mongoose.model('OAuthClients');


const ClientsService = {

    createClient: (clientId, clientSecret, redirectUris, grants) => {
    
        return new Promise((resolve, reject) => {

            // TODO: further validations

            var newClient = new OAuthClientsModel({
                clientId: clientId,
                clientSecret: clientSecret,
                redirectUris: redirectUris,
                grants: grants
            });

            newClient.save((err, client) => {
                if (err) {
                    console.error(err);
                    // TODO: Refactor mongoose validation errors (or custom validation)
                    reject(err.errors);
                } else {
                    console.log(`Created new client`);
                    resolve(client);
                }
            });

        });
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
    getClient: (clientId, clientSecret) => {
        return OAuthClientsModel.findOne({
            clientId: clientId,
            clientSecret: clientSecret
        })
        .lean();
    }

};

module.exports = ClientsService;