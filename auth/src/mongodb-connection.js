var mongoose = require('mongoose');

const HOST = process.env.MONGO_HOST || 'localhost';
const PORT = process.env.MONGO_PORT || '27017';
const DATABASE = process.env.MONGO_DATABASE || 'auth';

var connectString = `mongodb://${HOST}:${PORT}/${DATABASE}`;

mongoose.connect(connectString, (err, res) => {
    if (err) {
        console.error(`Unable to connected to ${connectString}`, err);
    } else {
        console.log(`Successfully connected to ${connectString}`);
    }
});

module.exports = mongoose;
