"use strict";

var express = require("express");
var app = express();
var expressWs = require("express-ws")(app);
var bodyParser = require("body-parser");

function getNormalizedReq(req) {
  return {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  };
}

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use("/test", function (req, res) {
  var normalizedReq = getNormalizedReq(req);
  console.log(`${normalizedReq.method} ${normalizedReq.url}`);
  console.log("headers:", normalizedReq.headers);
  console.log("body:", normalizedReq.body);

  res.send(normalizedReq);
});

app.ws("/test-ws", function(ws, req) {
  var normalizedReq = getNormalizedReq(req);
  console.log(`${normalizedReq.method} ${normalizedReq.url}`);
  console.log("headers:", normalizedReq.headers);
  console.log("body:", normalizedReq.body);

  ws.on('message', function(msg) {
    console.log("websocket message:", msg);
    ws.send(msg);
  });
});

app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});

app.listen(process.env.PORT || 3000);

module.exports = app;
