// external imports

// internal imports
const Order = require('../../../models/Order');
const { logger } = require('../../middleware/common/logger');

// GET - customer orders to admin page
const adminOrderIndex = async function (req, res, next) {
  try {
    const orders = await Order.find({ status: { $ne: 'completed' } }, null, {
      sort: { createdAt: -1 },
    })
      .select('-__v')
      .populate('customerId', '-password -__v')
      .exec();
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(200).json(orders);
    }
    return res.status(200).render('admin/order', { orders });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// exports
module.exports = {
  adminOrderIndex,
};
