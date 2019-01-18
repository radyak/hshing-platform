var express = require('express');
var router = express.Router();
var UserService = require("../service/UserService");

router.post('/', (req, res) => {

    var registration = req.body;

    UserService.createUser(
        registration.username,
        registration.email,
        registration.password,
        registration.passwordRepeat
    )
    .then(() => {
        res.status(200).send();
    })
    .catch(err => {
        res.status(400).send(err);
    });
    
});

router.post('/pseudo-login', (req, res) => {

    var login = req.body;

    UserService.verifyUser(login.username, login.password)
    .then(() => {
        res.status(204).end();
    })
    .catch((err) => {
        res.status(401).send({
            message: "Unauthorized"
        });
    });
    
});

module.exports = router;