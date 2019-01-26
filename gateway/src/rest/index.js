var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.raw());


app.use("/isalive", function (req, res) {
  res.status(204).end();
});

// proxy requires bodyParser.raw()!
app.use('/api', require("./api-proxy"));
app.use('/admin', bodyParser.json(), require("./admin"));
app.use('/auth', bodyParser.json(), require('./auth'));
app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});

module.exports = app;
