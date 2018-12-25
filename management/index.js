"use strict";

const DynDNSUpdater = require("./src/dyndns/DynDNSUpdater");
const greenlock = require("greenlock-express");
const app = require("./src/rest/index");
const AppContext = require("./src/util/AppContext");

require("./app-context");

AppContext.configService
  .getConfig()
  .then(config => {
    var dynDNSUpdater = new DynDNSUpdater(config);
    dynDNSUpdater.updateCyclic(1);
    return config;
  }).then(config => {
    greenlock.create({
      version: "draft-11",
      server: "https://acme-v02.api.letsencrypt.org/directory",
      configDir: "~/.config/acme/",
      email: config.admin.email,
      approvedDomains: [config.hostDomain],
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
