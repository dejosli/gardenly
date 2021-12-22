// external imports
import axios from 'axios';
import Noty from 'noty';

// variables
const addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter');

// notification - message
const notyMessage = function (
  msgType = 'warning',
  msg = 'There is no message to display!'
) {
  new Noty({
    type: msgType,
    layout: 'topRight',
    timeout: 500, // 0.5 second
    progressBar: false,
    text: msg,
  }).show();
};

// update cart
const updateCart = async function (pizza) {
  try {
    const res = await axios.post('/update-cart', pizza);
    cartCounter.innerText = res.data.totalQty;
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
