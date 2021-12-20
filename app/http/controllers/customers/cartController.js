// internal imports

// cart
const cartIndexController = (req, res) => {
  res.status(200).render('customers/cart');
};

// exports
module.exports = {
  cartIndexController,
};
