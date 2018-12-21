"use strict";

const DynDNSUpdater = require("./src/dyndns/DynDNSUpdater");
const ConfigService = require("./src/util/ConfigService");
const FileEnvKeyProvider = require("./src/util/FileEnvKeyProvider");
const greenlock = require("greenlock-express");
// const app = require("./rest/index");

var keyProvider = new FileEnvKeyProvider({
  file: (process.env.CONF_DIR || __dirname) + "/.env.key"
});
var configService = new ConfigService({
  file: (process.env.CONF_DIR || __dirname) + "/.env.conf",
  keyProvider: keyProvider
});

/********/
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

app.use("/encrypt", (req, res) => {
  configService
    .addConfig({
      test: "value"
    })
    .then(err => {
      if (err) {
        console.error(err);
        res.status(500).send();
      }
      res.status(200).send();
    })
    .catch(err => {
      console.error(err);
      res.status(500).send();
    });
});

app.use("*", function(req, res) {
  res.status(404).send("Invalid URL");
});
/********/

configService
  .getConfig()
  .then(config => {
    var dynDNSUpdater = new DynDNSUpdater(config.dynDns);
    dynDNSUpdater.updateCyclic(1);

    greenlock
      .create({
        version: "draft-11",
        server: "https://acme-v02.api.letsencrypt.org/directory",
        configDir: "~/.config/acme/",
        email: "contact@fvogel.net",
        approvedDomains: [config.dynDns.domain],
        agreeTos: true,
        app: app,
        communityMember: true,
        telemetry: false
      })
      .listen(80, 443);
  })
  .catch(err => {
    console.error(err);
  });
