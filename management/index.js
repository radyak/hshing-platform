"use strict";

const DynDNSUpdater = require("./src/dyndns/DynDNSUpdater");
const greenlock = require("greenlock-express");
const app = require("./src/rest/index");
const AppContext = require("./src/util/AppContext");

require("./app-context");

AppContext.configService
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
