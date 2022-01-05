// external imports
import axios from 'axios';
import Noty from 'noty';
import qs from 'qs';

// variables
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter');
const totalPriceEle = document.getElementById('total-price');
const registerFormEle = document.getElementById('registerForm');
const loginFormEle = document.getElementById('loginForm');
const logoutEle = document.getElementById('logout');
const decrementButtons = document.querySelectorAll(
  `button[data-action="decrement"]`
);
const incrementButtons = document.querySelectorAll(
  `button[data-action="increment"]`
);
const deleteItemButtons = document.querySelectorAll('.delete-item');
const orderFormEle = document.getElementById('order-form');

// notification - message
const notyMessage = function (
  msgType = 'warning',
  msg = 'There is no message to display!',
  notyTimeout = 1000
) {
  new Noty({
    type: msgType,
    layout: 'topRight',
    timeout: notyTimeout,
    progressBar: false,
    text: msg,
  }).show();
};

// add-to-cart btn
addToCart.forEach((btn) => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    let pizza = JSON.parse(btn.dataset.pizza);
    try {
      const res = await axios.post('/add-to-cart', pizza);
      cartCounter.innerText = res.data.cart.totalQty;
      notyMessage('success', 'Item added to cart'); // notification
    } catch (err) {
      console.log(err);
      notyMessage('error', 'Something went wrong'); // notification
    }
  });
});

// update cart item
const updateCart = async function (itemId, qty) {
  try {
    const res = await axios.put('/update-cart', { itemId, qty });
    const subtotalPrice = res.data.cart.items[itemId].price;
    const totalPrice = res.data.cart.totalPrice;
    cartCounter.innerText = res.data.cart.totalQty;
    return { subtotalPrice, totalPrice };
  } catch (err) {
    console.log(err);
  }
};

const deleteCartItemUI = (event, response) => {
  // if there is no item in cart
  if (!response.data.cart.totalQty) {
    window.location.href = window.location.href; // refresh current page
    return;
  }
  const cartItemEle = event.target.parentElement;
  cartItemEle.remove();
  cartCounter.innerText = response.data.cart.totalQty;
  totalPriceEle.innerText = `৳${response.data.cart.totalPrice}`;
};

// delete item
const deleteCartItem = async function (e) {
  const itemId = e.target.parentElement.dataset.pizzaId;
  try {
    const res = await axios.delete(`/delete-cart-item/${itemId}`);
    deleteCartItemUI(e, res); // (event, response)
  } catch (err) {
    console.log(err);
  }
};

// submit register form
const submitRegisterForm = async function (e) {
  e.preventDefault();

  // get form input value
  const username = registerFormEle.elements['username'].value;
  const email = registerFormEle.elements['email'].value;
  const password = registerFormEle.elements['password'].value;

  // serialize form data
  const registerFormData = qs.stringify({
    username,
    email,
    password,
  });
  try {
    const res = await axios.post('/register', registerFormData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });
    // if success - redirect to success url
    if (res.data.success) {
      location.replace(res.data.success.redirectUrl);
    }
    // if error - show notification
    const errors = res.data.errors;
    const timeout = 2500;
    if (errors.username) {
      notyMessage('error', 'Username is required');
      notyMessage(
        'error',
        'Name must not contain anything other than alphabet',
        timeout
      );
    }
    if (errors.email) {
      notyMessage('error', 'Invalid email address', timeout);
      notyMessage('error', 'Email already exists', timeout);
    }
    if (errors.password) {
      notyMessage(
        'error',
        'Password must be at least 8 characters long',
        timeout
      );
      notyMessage(
        'error',
        'Password should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol',
        timeout
      );
    }
  } catch (err) {
    console.log(err);
  }
};

// submit login form
const submitLoginForm = async function (e) {
  e.preventDefault();

  // get form input value
  const email = loginFormEle.elements['email'].value;
  const password = loginFormEle.elements['password'].value;

  // serialize form data
  const loginFormData = qs.stringify({
    email,
    password,
  });
  try {
    const res = await axios.post('/login', loginFormData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    });

    // if success - redirect to success url
    if (res.data.success) {
      location.replace(res.data.success.redirectUrl);
    }
    // if error - show notification
    const error = res.data.failure;
    const timeout = 2500;
    if (error) {
      notyMessage('error', error.msg, timeout);
    }
  } catch (err) {
    console.log(err);
  }
};

// decrement quantity counter
const decrement = async function (e) {
  const btn = e.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  );
  const itemId = btn.parentNode.parentElement.parentElement.dataset.pizzaId;
  const target = btn.nextElementSibling;
  const subtotalPriceEle =
    btn.parentNode.parentElement.parentElement.querySelector('.subtotal-price');
  let qty = Number(target.value);
  if (qty <= 1) {
    qty = 1;
  } else {
    qty--;
  }
  target.value = qty;
  const { subtotalPrice, totalPrice } = await updateCart(itemId, qty);
  subtotalPriceEle.innerText = `৳${subtotalPrice}`;
  totalPriceEle.innerText = `৳${totalPrice}`;
};

// increment quantity counter
const increment = async function (e) {
  const btn = e.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  );
  const itemId = btn.parentNode.parentElement.parentElement.dataset.pizzaId;
  const target = btn.nextElementSibling;
  const subtotalPriceEle =
    btn.parentNode.parentElement.parentElement.querySelector('.subtotal-price');
  let qty = Number(target.value);
  if (qty < 100) {
    qty++;
  } else {
    qty = 1;
  }
  target.value = qty;
  const { subtotalPrice, totalPrice } = await updateCart(itemId, qty);
  subtotalPriceEle.innerText = `৳${subtotalPrice}`;
  totalPriceEle.innerText = `৳${totalPrice}`;
};

// order submit process
const orderSubmit = async function (e) {
  e.preventDefault();

  // get input values
  const mobile = orderFormEle.elements['mobile'].value;
  const address = orderFormEle.elements['address'].value;

  const orderFormData = qs.stringify({
    mobile: `+88${mobile}`,
    address,
  });

  try {
    const res = await axios.post('/orders', orderFormData);
    // if success - redirect to success url
    if (res.data.success) {
      return location.replace(res.data.success.redirectUrl);
    }
    // if error - show notification
    const errors = res.data.errors;
    const timeout = 2500;
    if (errors.mobile) {
      notyMessage(
        'error',
        'Must be a valid Bangladeshi mobile number',
        timeout
      );
    }
    if (errors.address) {
      notyMessage('error', 'Shipping address is required', timeout);
    }
  } catch (err) {
    if (err.response) {
      notyMessage('error', err.response.data.error.message, 2500);
    }
  }
};

// register customer
if (registerFormEle) {
  registerFormEle.addEventListener('submit', submitRegisterForm);
}

// login customer
if (loginFormEle) {
  loginFormEle.addEventListener('submit', submitLoginForm);
}

// logout customer
if (logoutEle) {
  logoutEle.addEventListener('click', async function (e) {
    e.preventDefault();
    try {
      const res = await axios.post('/logout');
      // if success - redirect to success url
      if (res.data.success) {
        location.replace(res.data.success.redirectUrl);
      }
    } catch (err) {
      console.log(err);
    }
  });
}

// decrement quantity btn
decrementButtons.forEach((btn) => {
  btn.addEventListener('click', decrement);
});

// increment quantity btn
incrementButtons.forEach((btn) => {
  btn.addEventListener('click', increment);
});

// delete cart item btn
deleteItemButtons.forEach((btn) => {
  btn.addEventListener('click', deleteCartItem);
});

// order submit
if (orderFormEle) {
  orderFormEle.addEventListener('submit', orderSubmit);
}
