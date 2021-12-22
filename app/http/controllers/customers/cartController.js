// internal imports

// render cart page
const cartIndexController = (req, res) => {
  res.status(200).render('customers/cart');
};

// update cart
const updateCartController = (req, res) => {
  // for the first-time cart in session
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }
  const cart = req.session.cart;

  // check if item doesn't exist in cart
  const pizzaId = req.body._id;
  if (!cart.items[pizzaId]) {
    cart.items[pizzaId] = {
      item: req.body,
      qty: 1,
    };
    cart.totalQty += 1;
    cart.totalPrice += req.body.price;
  } else {
    cart.items[pizzaId].qty += 1;
    cart.totalQty += 1;
    cart.totalPrice += req.body.price;
  }

  res.status(200).json({ totalQty: cart.totalQty });
};
// exports
module.exports = {
  cartIndexController,
  updateCartController,
};
