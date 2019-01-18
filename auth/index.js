"use strict";

var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');

// Prepare DB
require('./src/persistence/mongodb-connection').then(() => {

  require("./src/persistence/model");

  var app = express();
  
  app.oauth = new OAuthServer({
    debug: true,
    model: require('./src/service/AuthService'), // See https://github.com/oauthjs/node-oauth2-server for specification
  });
  
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(bodyParser.json());
  app.use('/users', require('./src/rest/users'));

  app.use(app.oauth.authorize());

  // app.use("*", function (req, res) {
  //   console.log("Unmapped path");
  //   res.status(404).send("Unmapped path");
  // });
  
  app.listen(process.env.PORT || 3000);

});