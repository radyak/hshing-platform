var express = require('express');
var router = express.Router();

// 'http-proxy' may not be the best option;
// try http-proxy-middleware (https://www.npmjs.com/package/http-proxy-middleware, https://github.com/chimurai/http-proxy-middleware)
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

router.use('/:system/*', (req, res) => {
    var regex = new RegExp(`/api/${req.params.system}/`,'i');

    var backendUrl = req.originalUrl.replace(regex, '');
    var system = req.params.system;
    var port = 3000;

    var url = `http://${system}:${port}/${backendUrl}`;

    console.log("Forwarding http:// to " + url);

    // Attention: requires app.use(bodyParser.raw())!
    proxy.web(req, res, {target: url});
});

module.exports.web = router;


var websocket = function (req, socket, head) {
    // var system = req.originalUrl;
    // TODO: Replace!
    var url = 'http://test-app:3000/test-ws';

    console.log("Forwarding ws:// to " + url);

    proxy.ws(req, socket, head, {target: url});
}

module.exports.ws = websocket;