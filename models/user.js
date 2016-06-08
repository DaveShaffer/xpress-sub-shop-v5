var mongoose = require('mongoose');

var UserSchema = new Schema({
  name: String,
  item : {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  qty : Number
});

module.exports = mongoose.model('User', UserSchema);
