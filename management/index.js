"use strict";

const DynDNSUpdater = require("./src/dyndns/DynDNSUpdater");
const ConfigService = require("./src/util/ConfigService");

var configService = new ConfigService();
configService.getConfig().then(config => {
  var dynDNSUpdater = new DynDNSUpdater(config);
  dynDNSUpdater.updateCyclic(1);
});
