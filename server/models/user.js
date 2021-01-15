const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const roles = {
  values: ['USER', 'ADMIN'],
  message: '{VALUE} is not valid. '
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'The name is necessary']
  },
  email: {
    type: String,
    required: [true, 'The email is necessary'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'The password is necessary']
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    required: true,
    default: 'USER',
    enum: roles
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  },
});

userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

userSchema.plugin( uniqueValidator, {
  message: '{PATH} must be unique.'
});

module.exports = mongoose.model('User', userSchema);