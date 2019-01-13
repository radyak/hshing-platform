var express = require('express');
var router = express.Router();
var request = require('request');

// router.all("/:system/:restUrl([a-zA-Z-?#=]*)", (req, res) => {
router.all("/:system/*", (req, res) => {

    // Attention: does not work if backendUrl contains ".../api/[system]/..."!
    var regex = new RegExp(`.*/api/${req.params.system}/`,'i');

    var backendUrl = req.originalUrl.replace(regex, '/');
    var system = req.params.system;
    var port = 3000;

    var options = {
        url: `http://${system}:${port}${backendUrl}`,
        method: req.method,
        headers: req.headers
    };

    // Attention: requires .use(bodyParser.raw())!
    req.pipe(request(options)).pipe(res);
});

module.exports = router;