// external imports
const express = require('express');
const router = express.Router();

// internal imports
const {
  addUserValidators,
  addUserValidationHandler,
} = require('../app/http/middleware/validators/userValidators');
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require('../app/http/middleware/validators/loginValidators');
const {
  doOrderInfoValidators,
  doOrderInfoValidationHandler,
} = require('../app/http/middleware/validators/orderInfoValidators');

const { indexController } = require('../app/http/controllers/homeController');
const {
  getLoginController,
  getRegisterController,
  registerController,
  loginController,
  logoutController,
} = require('../app/http/controllers/authController');
const {
  initSessionCart,
  cartIndex,
  addToCart,
  updateCart,
  deleteCartItem,
} = require('../app/http/controllers/customers/cartController');
const {
  orderIndex,
  orderStore,
} = require('../app/http/controllers/customers/orderController');

// Middlewares
const isLoggedIn = require('../app/http/middleware/auth/isLoggedIn');
const authGuard = require('../app/http/middleware/auth/authGuard');
const authRole = require('../app/http/middleware/auth/authRole');

// Admin routes controllers
const {
  adminOrderIndex,
} = require('../app/http/controllers/admin/orderController');
const {
  orderStatusUpdate,
  trackOrderStatus,
} = require('../app/http/controllers/admin/statusController');

// write routes here
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

// write customer routes here
// order routes
router.post(
  '/orders',
  authGuard,
  doOrderInfoValidators,
  doOrderInfoValidationHandler,
  orderStore
);
router.get('/customer/orders', authGuard, orderIndex);
router.get('/customer/orders/:id', authGuard, trackOrderStatus);

// Admin routes
router.get('/admin/orders', authGuard, authRole('admin'), adminOrderIndex);
router.post(
  '/admin/order/status',
  authGuard,
  authRole('admin'),
  orderStatusUpdate
);

// exports
module.exports = router;
