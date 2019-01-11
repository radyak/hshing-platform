const greenlock = require("greenlock-express");
const app = require("../rest/index");
const Env = require("../util/Env");

module.exports = function (config) {

    if (Env.isProd()) {
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

    } else {
        console.log("Using unsecured HTTP traffic - FOR DEVELOPMENT ONLY");
        app.listen(80);
    }
}