var PasswordHashService = require('./PasswordHashService');
var mongoose = require('mongoose');

var OAuthUsersModel = mongoose.model('OAuthUsers');


const UserService = {

    createUser: (username, email, password, passwordRepeat) => {
    
        return new Promise((resolve, reject) => {
            if (password !== passwordRepeat) {
                reject("Password and password repeat differ");
                return;
            }

            // TODO: further validations

            var newUser = new OAuthUsersModel({
                email: email,
                password: PasswordHashService.encrypt(password),
                username: username
            });

            newUser.save((err, user) => {
                if (err) {
                    console.error(err);
                    // TODO: Refactor mongoose validation errors (or custom validation)
                    reject(err.errors);
                } else {
                    console.log(`Created new user`);
                    resolve(user);
                }
            });

        });
    },

    verifyUser: (username, password) => {

        return OAuthUsersModel.findOne({
            username: username
        })
        .then((user) => {
            
            // TODO: remove!
            console.log("user", user);
            console.log(`Comparing ${password} and ${user.password}`);

            if (PasswordHashService.check(password, user.password)) {
                return user;
            } else {
                throw new Error({
                    message: "No matching user"
                });
            }
        });
    }

};

module.exports = UserService;