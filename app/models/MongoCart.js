// external imports
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
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

// methods
cartSchema.methods.calTotalQty = function () {
  console.log(this);
  let qty = 0;
  this.items.forEach((item) => {
    qty = qty + item.qty;
  });
  return qty;
};

cartSchema.methods.calTotalPrice = function () {
  let price = 0;
  this.items.forEach((item) => {
    price = price + item.qty * item.price;
  });
  return price;
};

// exports
module.exports = mongoose.model('Cart', cartSchema);
