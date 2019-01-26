const DynDNSUpdater = require("../../dyndns/DynDNSUpdater");
const AppContext = require("../../util/AppContext");
const Env = require("../../util/Env");

module.exports = function (config) {
    return new Promise((resolve, reject) => {
        if (Env.isProd()) {
            AppContext.register("dynDNSUpdater", new DynDNSUpdater(config).updateCyclic());
        }
        resolve(config);
    });
}