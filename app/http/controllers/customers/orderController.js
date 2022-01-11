// external imports
const moment = require('moment');

// internal imports
const { logger } = require('../../middleware/common/logger');
const Order = require('../../../models/Order');
const MongoCart = require('../../../models/MongoCart');

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
    await order.save();
    // delete user cart from db
    await MongoCart.deleteOne({ userId: req.user._id });
    // delete user cart from session
    delete req.session.cart;
    // send flash message to the user
    req.flash('success', 'Order Placed Successfully');
    return res.status(201).json({
      success: {
        message: 'Order Placed Successfully',
        redirectUrl: '/customer/orders',
      },
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).json({
      error: { message: 'Something went wrong', redirectUrl: '/cart' },
    });
  }
};

// GET - customer order page
const orderIndex = async function (req, res, next) {
  try {
    const orders = await Order.find({ customerId: req.user._id }, null, {
      sort: { createdAt: -1 },
    });
    res.header('Cache-Control', 'no-store');
    res.status(200).render('customers/order', { orders, moment });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// exports
module.exports = {
  orderIndex,
  orderStore,
};
