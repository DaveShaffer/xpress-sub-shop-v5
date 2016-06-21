var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: String, // Customer's name
  // item: [ {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Item'
  // } ], // Item ordered from the menu
  item: Array,
  price: Number // Number of each item ordered by the customer
});

module.exports = mongoose.model('User', UserSchema);
