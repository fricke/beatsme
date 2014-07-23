var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Game = new Schema({
    creator_id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    players: {
      type: [ Schema.Types.Mixed ],
      index: true,
      required: true
    },
    players_stats: Schema.Types.Mixed,
    cards: {
      type: [ Schema.Types.Mixed ],
      required: true
    },
    current_hand: Schema.Types.Mixed,
    winning_cards: [ Schema.Types.ObjectId ],
    created_at: { type: Date, 'default': Date.now }
});


module.exports = mongoose.model('Game', Game);
