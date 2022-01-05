// external imports
const mongoose = require('mongoose');

// create schema
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: Object,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentType: {
      type: String,
      default: 'COD',
    },
    status: {
      type: String,
      default: 'order_placed',
    },
  },
  {
    timestamps: true,
  }
);

// exports
module.exports = mongoose.model('Order', orderSchema);
