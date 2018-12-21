"use strict";

const DynDNSUpdater = require("./src/dyndns/DynDNSUpdater");
const ConfigService = require("./src/util/ConfigService");
const greenlock = require("greenlock-express");
const app = require("./rest/index");

var configService = new ConfigService({
  file: (process.env.CONF_DIR || __dirname) + "/.env.json"
});
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
        approvedDomains: ["test002.fvogel.net"],
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
