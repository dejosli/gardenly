// external imports
const express = require('express');
const router = express.Router();

// internal imports
const { indexController } = require('../app/http/controllers/homeController');
const {
  getLoginController,
  getRegisterController,
  registerController,
  loginController,
  logoutController,
  isLoggedIn,
} = require('../app/http/controllers/authController');
const {
  initSessionCart,
  cartIndex,
  addToCart,
  updateCart,
  deleteCartItem,
} = require('../app/http/controllers/customers/cartController');
const {
  addUserValidators,
  addUserValidationHandler,
} = require('../app/http/middleware/auth/userValidators');
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require('../app/http/middleware/auth/loginValidators');

// index routes
router.get('/', initSessionCart, indexController);

// login routes
router.get('/login', isLoggedIn, getLoginController);
router.post(
  '/login',
  isLoggedIn,
  doLoginValidators,
  doLoginValidationHandler,
  loginController
);
router.post('/logout', logoutController);

// register routes
router.get('/register', isLoggedIn, getRegisterController);
router.post(
  '/register',
  isLoggedIn,
  addUserValidators,
  addUserValidationHandler,
  registerController
);

// cart routes
router.get('/cart', cartIndex);
router.post('/add-to-cart', addToCart);
router.put('/update-cart', updateCart);
router.delete('/delete-cart-item/:id', deleteCartItem);

// exports
module.exports = router;
