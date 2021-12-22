// external imports
var express = require('express');
var router = express.Router();

// internal imports
const { indexController } = require('../app/http/controllers/homeController');
const {
  loginController,
  registerController,
} = require('../app/http/controllers/authController');
const {
  cartIndexController,
  updateCartController,
} = require('../app/http/controllers/customers/cartController');

// index routes
router.get('/', indexController);
// login routes
router.get('/login', loginController);
// register routes
router.get('/register', registerController);

// cart routes
router.get('/cart', cartIndexController);
router.post('/update-cart', updateCartController);

// exports
module.exports = router;
