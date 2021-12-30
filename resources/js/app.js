// external imports
import axios from 'axios';
import Noty from 'noty';
import qs from 'qs';

// variables
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter');
const registerFormEle = document.getElementById('registerForm');
const loginFormEle = document.getElementById('loginForm');
const logoutEle = document.getElementById('logout');
const decrementButtons = document.querySelectorAll(
  `button[data-action="decrement"]`
);
const incrementButtons = document.querySelectorAll(
  `button[data-action="increment"]`
);

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

// update cart
const updateCart = async function (pizza) {
  try {
    const res = await axios.post('/update-cart', pizza);
    cartCounter.innerText = res.data.cart.totalQty;
    notyMessage('success', 'Item added to cart'); // notification
  } catch (err) {
    console.log(err);
    notyMessage('error', 'Something went wrong'); // notification
  }
};

// add-to-cart btn
addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

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
const decrement = function (e) {
  const btn = e.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  );
  const target = btn.nextElementSibling;
  let value = Number(target.value);
  if (value <= 1) {
    value = 1;
  } else {
    value--;
  }

  target.value = value;
};

// increment quantity counter
const increment = function (e) {
  const btn = e.target.parentNode.parentElement.querySelector(
    'button[data-action="decrement"]'
  );
  const target = btn.nextElementSibling;
  let value = Number(target.value);
  if (value < 100) {
    value++;
  } else {
    value = 1;
  }

  target.value = value;
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
