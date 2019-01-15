var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

app.use("/isAlive", function (req, res) {
  res.status(200).end();
});

app.use('/admin', require("./admin"));
app.use('/api', require("./api-proxy"));

app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});


module.exports = app;
