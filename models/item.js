var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qty: Number, // Number of items in inventory
  quantity: { type: Number, default: 1 }, // Total number of items in the customer's order
  serving: { type: Number, default: 1 }, // Single menu item
  delDate: Date, // The date the item arrived at Sub Shop
  age: { type: Number, default: 0 }, // Number of days item has been at Sub Shop
  shelfLife: Number // Number of days before item expires
}, { timestamps: true } );

module.exports = mongoose.model('Item', ItemSchema);
