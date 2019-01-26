var express = require('express');
var router = express.Router();
var UserService = require("../../service/UserService");

router.post('/', (req, res) => {

    var registration = req.body;

    UserService.createUser(
        registration.username,
        registration.email,
        registration.password,
        registration.passwordRepeat
    )
    .then((user) => {
        res.status(200).send(user);
    })
    .catch(err => {
        res.status(400).send(err);
    });
    
});

module.exports = router;