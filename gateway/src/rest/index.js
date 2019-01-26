var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var AppContext = require("../util/AppContext");

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



var oauth = AppContext.OAuthServer;

app.use('/auth/users', bodyParser.json(), require('./auth/users'));
app.use('/auth/clients', bodyParser.json(), require('./auth/clients'));

app.use("/auth/token", bodyParser.json(), oauth.token());
app.use("/auth/authorize", bodyParser.json(), oauth.authorize());


app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});

module.exports = app;
