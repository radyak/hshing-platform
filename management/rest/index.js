var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use("/isAlive", function(req, res) {
  res.status(200).send("Aww yiss");
});

app.use("/test", function(req, res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("Hello, World!\n\n💚 🔒.js");
});

app.use("*", function(req, res) {
  res.status(404).send("Invalid URL");
});

module.exports = app;
