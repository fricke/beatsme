var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    display_name: String,
    external_ids: {
      type: [String],
      index: true
    },
    provider: Schema.Types.Mixed,
    create_date: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('User', User);
