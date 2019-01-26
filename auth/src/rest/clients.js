var express = require('express');
var router = express.Router();
var ClientService = require('../service/ClientService');

router.post('/', (req, res) => {

    var clientInfo = req.body;

    // TODO: which fields must be generated?
    ClientService.createClient(
        clientInfo.clientId,
        clientInfo.redirectUris,
        clientInfo.grants
    )
    .then((client) => {
        res.status(200).send(client);
    })
    .catch(err => {
        res.status(400).send(err);
    });
    
});

module.exports = router;