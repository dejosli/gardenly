// internal imports

// GET - cart page
const cartIndexController = (req, res, next) => {
  res.status(200).render('customers/cart');
};

// POST - update cart
const updateCartController = (req, res, next) => {
  // for the first-time cart in session
  if (!req.session.cart) {
    req.session.cart = {
      guest: {
        items: {},
        totalQty: 0,
        totalPrice: 0,
      },
    };
  }

  const cart = req.session.cart;
  let cartId = 'guest';

  // check if the user is authenticated
  if (req.isAuthenticated()) {
    if (Object.keys(req.session.cart).indexOf(req.user.id) > -1) {
      cartId = req.user.id;
      console.log('second time auth user');
    } else {
      // first time authenticated user initialize
      cartId = req.user.id;
      cart[cartId] = cart['guest'];
      cart['guest'] = {
        items: {},
        totalQty: 0,
        totalPrice: 0,
      };
      console.log('first time auth user');
    }
  }
  // check if item doesn't exist in cart
  const pizzaId = req.body._id;
  if (!cart[cartId].items[pizzaId]) {
    cart[cartId].items[pizzaId] = {
      item: req.body,
      qty: 1,
    };
    cart[cartId].totalQty += 1;
    cart[cartId].totalPrice += req.body.price;
  } else {
    cart[cartId].items[pizzaId].qty += 1;
    cart[cartId].totalQty += 1;
    cart[cartId].totalPrice += req.body.price;
  }
  res.status(200).json({ cart: cart[cartId] });
};

// exports
module.exports = {
  cartIndexController,
  updateCartController,
};
