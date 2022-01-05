// external imports
const moment = require('moment');

// internal imports
const Order = require('../../../models/Order');

// write here
// POST - save order to db
const orderStore = async function (req, res, next) {
  const { mobile, address } = req.body;
  try {
    // process order data
    let order = new Order({
      customerId: req.user._id,
      items: req.session.cart.items,
      mobile,
      address,
    });
    order = await order.save();
    return res.status(201).json({
      success: {
        message: 'Order added successfully',
        redirectUrl: '/customer/orders',
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: { message: 'Something went wrong', redirectUrl: '/cart' },
    });
  }
};

// GET - customer order page
const orderIndex = async function (req, res, next) {
  try {
    const orders = await Order.find({ customerId: req.user._id });
    return res.status(200).render('customers/order', { orders, moment });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// exports
module.exports = {
  orderIndex,
  orderStore,
};
