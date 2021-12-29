// external imports
const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'People',
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Menu',
        },
        name: String,
        image: String,
        size: String,
        qty: Number,
        price: Number,
      },
    ],
    totalQty: Number,
    totalPrice: Number,
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// exports
module.exports = mongoose.model('Cart', CartSchema);
