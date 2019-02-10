var express = require('express')
var router = express.Router()
var DockerContainerService = require('../service/DockerContainerService')

router.get('/', (req, res) => {
    DockerContainerService.getContainers().then((containers) => {
        res.status(200).send(containers);
    });
});

module.exports = router