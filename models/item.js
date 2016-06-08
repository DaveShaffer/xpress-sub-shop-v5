var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  qty: Number,
  quantity: { type: Number, default: 1 },
  serving: { type: Number, default: 1 },
  delDate: Date,
  age: { type: Number, default: 0 },
  shelfLife: Number
}, { timestamps: true } );

module.exports = mongoose.model('Item', ItemSchema);
