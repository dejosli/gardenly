// external imports

// internal imports
const Order = require('../../../models/Order');

// POST - order status update
const orderStatusUpdate = async function (req, res, next) {
  try {
    const { orderId, status } = req.body;
    await Order.updateOne({ _id: orderId }, { status: status });
    res.redirect('/admin/orders');
  } catch {
    res.redirect('/admin/orders');
  }
};

// GET - track order status changes
const trackOrderStatus = async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    // authorize to track user order
    if (req.user._id.toString() === order.customerId.toString()) {
      return res.render('customers/trackOrder', { order });
    }
    return res.redirect('/');
  } catch (err) {
    next(err);
  }
};

// exports
module.exports = {
  orderStatusUpdate,
  trackOrderStatus,
};
