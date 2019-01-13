const greenlock = require("greenlock-express");
const app = require("../rest/index");
const Env = require("../util/Env");

module.exports = function (config) {

    var server;

    if (Env.isProd()) {
        server = greenlock.create({
            version: "draft-11",
            server: "https://acme-v02.api.letsencrypt.org/directory",
            configDir: "~/.config/acme/",
            email: config.admin.email,
            approvedDomains: [config.hostDomain],
            agreeTos: true,
            app: app,
            communityMember: true,
            telemetry: false
        });
        server.listen(80, 443);

    } else {
        console.log("Using unsecured HTTP traffic - FOR DEVELOPMENT ONLY");
        server = app.listen(80);
    }

    // TODO: Test
    // TODO: Forward to correct backend system URL
    server.on('upgrade', function (req, socket, head) {
        proxy.ws(req, socket, head, {target: req.originalUrl});
    });
}