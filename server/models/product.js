const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;



let productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The name is required']
  },
  price: {
    type: Number,
    required: [true, 'The price is required']
  },
  description: {
    type: String,
    required: false
  },
  available: {
    type: Boolean,
    required: true, default: true
  },
  category: {
    type: ObjectId, ref: 'Category',
    required: true
  },
  user: {
    type: ObjectId, ref: 'User',
    required: true
  }
});


module.exports = mongoose.model('Product', productSchema);