// external imports
const mongoose = require('mongoose');

// create schema
const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

// create model
const Menu = mongoose.model('Menu', menuSchema);

// exports
module.exports = Menu;
