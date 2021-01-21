const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
  
let categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'The name is necessary'],
    unique: true
  },
  user: {
    type: ObjectId,
    ref: 'User',
    index: true
  }
});

categorySchema.plugin(uniqueValidator, {
  message: '{PATH} must be unique.'
});

module.exports = mongoose.model('Category', categorySchema);