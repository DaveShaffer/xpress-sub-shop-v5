var mongoose = require('mongoose');

var UserSchema = new Schema({
  name: String, // Customer's name
  item : {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  }, // Item ordered from the menu
  qty : Number // Number of each item ordered by the customer
});

module.exports = mongoose.model('User', UserSchema);
