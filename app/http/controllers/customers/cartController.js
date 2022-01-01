// internal imports
const MongoCart = require('../../../models/MongoCart');
const SessionCart = require('../../../models/SessionCart');

// utilities
const toSessionData = (mongoCart) => {
  const cart = {};
  cart.items = {};
  mongoCart.items.forEach((item) => {
    cart.items[item.itemId] = {
      item: {
        _id: item.itemId,
        name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
      },
      qty: item.qty,
      price: item.qty * item.price,
    };
  });
  cart.totalQty = mongoCart.totalQty;
  cart.totalPrice = mongoCart.totalPrice;
  return cart;
};

const toMongoData = (req) => {
  const sessionCart =
    req.session.cart && req.session.cart.items
      ? req.session.cart
      : new SessionCart({});
  const cart = {};
  cart.userId = req.user.id;
  cart.items = [];
  for (let itemId in sessionCart.items) {
    cart.items.push({
      itemId: itemId,
      name: sessionCart.items[itemId].item.name,
      image: sessionCart.items[itemId].item.image,
      price: sessionCart.items[itemId].item.price,
      size: sessionCart.items[itemId].item.size,
      qty: sessionCart.items[itemId].qty,
      price: sessionCart.items[itemId].item.price,
    });
  }
  cart.totalQty = sessionCart.totalQty;
  cart.totalPrice = sessionCart.totalPrice;
  return cart;
};

// initialize session cart
const initSessionCart = (req, res, next) => {
  req.session.cart = new SessionCart(req.session.cart ? req.session.cart : {});
  next();
};

// GET - cart page
const cartIndex = (req, res, next) => {
  res.status(200).render('customers/cart');
};

// POST - add to cart
const addToCart = async (req, res, next) => {
  // update mongodb cart
  if (req.isAuthenticated()) {
    let cart;
    const userId = req.user.id;

    try {
      let mongoCart = await MongoCart.findOne({
        userId,
      });
      // cart exists for user
      if (mongoCart) {
        let itemIndex = mongoCart.items.findIndex(
          (item) => item.itemId == req.body._id
        );
        // item exists in the cart
        if (itemIndex > -1) {
          let storedItem = mongoCart.items[itemIndex];
          storedItem.qty++;
          mongoCart.totalQty++;
          mongoCart.totalPrice += storedItem.price;
        } else {
          // item does not exists in cart, add new item
          mongoCart.items.push({
            itemId: req.body._id,
            name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            size: req.body.size,
            qty: 1,
          });
          let index = mongoCart.items.findIndex(
            (item) => item.itemId == req.body._id
          );
          let storedItem = mongoCart.items[index];
          mongoCart.totalQty++;
          mongoCart.totalPrice += storedItem.price;
        }
        // update cart
        mongoCart = await mongoCart.save();
        cart = toSessionData(mongoCart);
      } else {
        // no cart in mondo-db for user, create new cart
        let newCart = await MongoCart.create({
          userId,
          items: [
            {
              itemId: req.body._id,
              name: req.body.name,
              image: req.body.image,
              price: req.body.price,
              size: req.body.size,
              qty: 1,
            },
          ],
          totalQty: 1,
          totalPrice: req.body.price,
        });
        // update cart
        // newCart = await newCart.save(); //TODO:
        cart = toSessionData(newCart);
      }
      // update session cart
      req.session.cart = cart;
      return res.status(201).json({ cart });
    } catch (err) {
      console.log(err);
      return res.status(500).send('Something went wrong');
    }
  }
  // update session cart
  const sessionCart = new SessionCart(req.session.cart ? req.session.cart : {});
  sessionCart.add(req.body, req.body._id);
  req.session.cart = sessionCart;
  res.status(201).json({ cart: sessionCart });
};

// PUT - update cart item
const updateCart = async (req, res, next) => {
  const { itemId, qty: newQty } = req.body;
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    try {
      let mongoCart = await MongoCart.findOne({
        userId,
      });
      // cart exists for user
      if (mongoCart) {
        let itemIndex = mongoCart.items.findIndex(
          (item) => item.itemId == itemId
        );
        // item exists in the cart
        if (itemIndex > -1) {
          let storedItem = mongoCart.items[itemIndex];
          storedItem.qty = newQty;
          mongoCart.totalQty = mongoCart.calTotalQty();
          mongoCart.totalPrice = mongoCart.calTotalPrice();
        }
        // update cart
        mongoCart = await mongoCart.save();
        req.session.cart = toSessionData(mongoCart);
        return res.status(201).json({
          message: 'Item updated successfully',
          cart: toSessionData(mongoCart),
        });
      }
      return res.status(500).json({ error: 'Item updated failed' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
  // update session cart
  const sessionCart = new SessionCart(req.session.cart);
  sessionCart.update(itemId, newQty);
  req.session.cart = sessionCart;
  res
    .status(201)
    .json({ message: 'Item updated successfully', cart: sessionCart });
};

// DELETE -  delete item from cart
const deleteCartItem = async (req, res, next) => {
  const itemId = req.params.id;
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    try {
      let mongoCart = await MongoCart.findOne({
        userId,
      });
      // cart exists for user
      if (mongoCart) {
        let itemIndex = mongoCart.items.findIndex(
          (item) => item.itemId == itemId
        );
        // item exists in the cart
        if (itemIndex > -1) {
          mongoCart.items.splice(itemIndex, 1); // delete item from cart
          mongoCart.totalQty = mongoCart.calTotalQty();
          mongoCart.totalPrice = mongoCart.calTotalPrice();
        }
        // update cart
        mongoCart = await mongoCart.save();
        req.session.cart = toSessionData(mongoCart);
        return res.status(201).json({
          message: 'Item deleted successfully',
          cart: toSessionData(mongoCart),
        });
      }
      return res.status(500).json({ error: 'Item deletion failed' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }
  // update session cart
  const sessionCart = new SessionCart(req.session.cart);
  sessionCart.remove(itemId);
  req.session.cart = sessionCart;
  res
    .status(201)
    .json({ message: 'Item deleted successfully', cart: sessionCart });
};

const loggedInUserCart = async (req, res) => {
  const sessionCart = req.session.cart;
  const userId = req.user.id;
  try {
    let mongoCart = await MongoCart.findOne({
      userId,
    });
    if (mongoCart) {
      return toSessionData(mongoCart);
    }
    return sessionCart;
  } catch (err) {
    return err;
  }
};

const mergeCart = async (req, res) => {
  let mongoCart = toMongoData(req); // convert session cart data to mongodb data
  const userId = req.user.id;
  try {
    let userCart = await MongoCart.findOne({
      userId,
    });
    if (userCart) {
      mongoCart.items.forEach((cartItem) => {
        let itemIndex = userCart.items.findIndex(
          (item) => item.itemId == cartItem.itemId
        );
        // item exists in the cart
        if (itemIndex > -1) {
          let storedItem = userCart.items[itemIndex];
          storedItem.qty += cartItem.qty;
          userCart.totalQty += cartItem.qty;
          userCart.totalPrice =
            userCart.totalPrice + cartItem.qty * storedItem.price;
        } else {
          // item does not exists in cart, add new-item
          userCart.items.push({
            itemId: cartItem.itemId,
            name: cartItem.name,
            image: cartItem.image,
            price: cartItem.price,
            size: cartItem.size,
            qty: 1,
          });
          let index = userCart.items.findIndex(
            (item) => item.itemId == cartItem.itemId
          );
          let storedItem = userCart.items[index];
          storedItem.qty += cartItem.qty;
          userCart.totalPrice =
            userCart.totalPrice + cartItem.qty * storedItem.price;
        }
        //TODO:
      });
      // update cart
      userCart.save((err, result) => {
        if (err) {
          console.log(err);
        } else {
          userCart = result;
        }
      });
      // userCart = await userCart.save();
      return toSessionData(userCart);
    }
    let newCart = await MongoCart.create(mongoCart);
    return toSessionData(newCart);
  } catch (err) {
    console.log(err);
  }
};

// exports
module.exports = {
  initSessionCart,
  cartIndex,
  addToCart,
  updateCart,
  deleteCartItem,
  loggedInUserCart,
  mergeCart,
};
