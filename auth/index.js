"use strict";

var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');

// Connect
require('./src/mongodb-connection');

var app = express();
 
app.oauth = new OAuthServer({
  debug: true,
  model: require('./src/model'), // See https://github.com/oauthjs/node-oauth2-server for specification
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.oauth.authorize());

app.use(function(req, res) {
  res.send('Secret area');
});
 
app.listen(process.env.PORT || 3000);