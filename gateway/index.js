"use strict";

const AppContext = require("./src/util/AppContext");

require("./app-context");

AppContext.configService
  .getConfig()
  .then(config => {
    require("./src/bootstrap/dyndns")(config);
    require("./src/bootstrap/server")(config);
  })
  .catch(err => {
    console.error(err);
  });
