var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessToken = new Schema({
    user_id: {
        type: String,
        required: true
    },
    client_id: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AccessToken', AccessToken);
