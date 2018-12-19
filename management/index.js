"use strict";

const DynDNSUpdater = require("./src/dyndns/DynDNSUpdater");

var dynDNSUpdater = new DynDNSUpdater({
  username: "fvogel.net",
  password: "12f68922dc",
  dynDnsHost: "dyndns.strato.com",
  domain: "test001.fvogel.net"
});

dynDNSUpdater.updateCyclic(1);
