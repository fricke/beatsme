var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    client_id: {
        type: String,
        unique: true,
        required: true
    },
    client_secret: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Client', Client);
