"use strict";

const AppContext = require("./src/util/AppContext");
const Bootstrapper = require("./src/bootstrap/Bootstrapper");

require("./app-context");

Bootstrapper.bootstrap(
    AppContext.configService.getConfig(),
    [
      "dyndns",
      "persistence",
      "oauth",
      "server"
    ]
);