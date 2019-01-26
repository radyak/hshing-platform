var express = require('express');
var router = express.Router();
var AppContext = require("../util/AppContext");

router.get("/config", (req, res) => {
    return AppContext.configService.getConfigSecure().then(config => {
        res.status(200).send(config);
    });
});

module.exports = router;