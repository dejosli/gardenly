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
      price: item.price,
    };
  });
  cart.totalQty = mongoCart.totalQty;
  cart.totalPrice = mongoCart.totalPrice;
  return cart;
};

const toMongoData = (req) => {
  const sessionCart = req.session.cart;
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
      price: sessionCart.items[itemId].price,
    });
  }
  cart.totalQty = sessionCart.totalQty;
  cart.totalPrice = sessionCart.totalPrice;
  return cart;
};

// GET - cart page
const cartIndexController = (req, res, next) => {
  res.status(200).render('customers/cart');
};

const updateCartController = async (req, res, next) => {
  // update mongodb cart
  if (req.isAuthenticated()) {
    let cart;
    const userId = req.user.id;

    try {
      let mongoCart = await MongoCart.findOne({
        userId,
      });

      if (mongoCart) {
        //cart exists for user
        let itemIndex = mongoCart.items.findIndex(
          (item) => item.itemId == req.body._id
        );

        if (itemIndex > -1) {
          // item exists in the cart
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

const initSessionCart = (req, res, next) => {
  req.session.cart = new SessionCart(req.session.cart ? req.session.cart : {});
  next();
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
  const mongoCart = toMongoData(req);
  const userId = req.user.id;
  try {
    let userCart = await MongoCart.findOne({
      userId,
    });
    if (userCart) {
      await MongoCart.deleteOne({ userId });
    }
    let newCart = await MongoCart.create(mongoCart);
    return toSessionData(newCart);
  } catch (err) {
    console.log(err);
  }
};

// exports
module.exports = {
  cartIndexController,
  updateCartController,
  initSessionCart,
  loggedInUserCart,
  mergeCart,
};
