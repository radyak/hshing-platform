var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var OAuthServer = require('express-oauth-server');

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use("/isAlive", function (req, res) {
  res.status(204).end();
});

app.use('/admin', require("./admin/index"));
app.use('/api', require("./api-proxy/index"));



//require('./src/persistence/mongodb-connection').then(() => {    ...rest of file

require('../persistence/mongodb-connection')
require('../persistence/model/index');

app.oauth = new OAuthServer({
  debug: true,
  model: require('../service/AuthService'), // See https://github.com/oauthjs/node-oauth2-server for specification
});

// app.use();
app.use('/auth/users', bodyParser.json(), require('./auth/users'));
app.use('/auth/clients', bodyParser.json(), require('./auth/clients'));

app.use("/auth/token", bodyParser.json(), app.oauth.token());
app.use("/auth/authorize", bodyParser.json(), app.oauth.authorize());


app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});

module.exports = app;
