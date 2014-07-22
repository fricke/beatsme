var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Game = new Schema({
    creator_id: Schema.Types.ObjectId,
    players: {
      type: [ Schema.Types.ObjectId ],
      index: true
    },
    players_stats: Schema.Types.Mixed,
    cards: [ Schema.Types.Mixed ],
    winning_cards: [ Schema.Types.ObjectId ],
    start: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 100
    },
    createdAt: { type: Date, 'default': Date.now }
});


module.exports = mongoose.model('Game', Game);
