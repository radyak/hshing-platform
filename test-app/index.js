"use strict";

var express = require("express");
var app = express();

var jwt = require('express-jwt');
var jwtPermissions = require('express-jwt-permissions');

require("express-ws")(app);

var bodyParser = require("body-parser");


function normalizeReq(req) {
  var normalizedReq = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
    user: req.user
  };

  console.log(`${normalizedReq.method} ${normalizedReq.url}`);
  console.log("headers:", normalizedReq.headers);
  console.log("body:", normalizedReq.body);

  return normalizedReq;
}

function debug (req, res) {
  var normalizedReq = normalizeReq(req);
  console.log(`${normalizedReq.method} ${normalizedReq.url}`);
  console.log("headers:", normalizedReq.headers);
  console.log("body:", normalizedReq.body);

  res.send(normalizedReq);
}


app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.ws("/ws", function(ws, req) {
  normalizeReq(req);

  ws.on('message', function(msg) {
    console.log("websocket message:", msg);
    ws.send(msg);
  });
});

app.use("/secured", jwt({
  secret: 'secret'
}), debug);

app.use("*", debug);

app.listen(process.env.PORT || 3000);

module.exports = app;
