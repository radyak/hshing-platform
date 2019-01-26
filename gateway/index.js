"use strict";

const AppContext = require("./src/util/AppContext");

require("./app-context");

AppContext.configService
  .getConfig()
  .then(config => {
    return require("./src/bootstrap/dyndns")(config);
  }).then(config => {
    return require("./src/bootstrap/persistence")(config)
  }).then(config => {
    return require("./src/bootstrap/oauth")(config);
  }).then(config => {
    return require("./src/bootstrap/server")(config);
  })
  .catch(err => {
    console.error("Error during application startup", err);
  });
