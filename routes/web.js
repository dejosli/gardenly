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
  cartIndexController,
  updateCartController,
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
router.get('/', indexController);

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
router.get('/cart', cartIndexController);
router.post('/update-cart', updateCartController);

// exports
module.exports = router;
