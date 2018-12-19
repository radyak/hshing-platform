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

app.use("*", function(req, res) {
  res.status(404).send("Invalid URL");
});

app.listen(3001);
