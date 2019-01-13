var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

var adminRoutes = require("./admin");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.raw());
// app.use(bodyParser.json());

app.use("/isAlive", function (req, res) {
  res.status(200).end();
});

app.use('/admin', adminRoutes);

// Old solution: require("./api-proxy_with-requests.js");
app.use('/api/:system/*', (req, res) => {
    var regex = new RegExp(`/api/${req.params.system}/`,'i');

    var backendUrl = req.originalUrl.replace(regex, '');
    var system = req.params.system;
    var port = 3000;

    var url = `http://${system}:${port}/${backendUrl}`;

    console.log("Forwarding to " + url);

    // Attention: requires app.use(bodyParser.raw())!
    proxy.web(req, res, {target: url});
});

app.use("*", function (req, res) {
  res.status(404).send("Invalid URL");
});


module.exports = app;
