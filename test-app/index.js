"use strict";

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use("/test", function (req, res) {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log("headers:", req.headers);
  console.log("body:", req.body);

  var payload = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  };

  res.send(payload);
});

app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});

app.listen(process.env.PORT || 3000);

module.exports = app;
