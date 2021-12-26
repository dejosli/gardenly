// internal imports
const Menu = require('../../models/Menu');

// render home
const indexController = async (req, res, next) => {
  try {
    const pizzas = await Menu.find();
    res
      .status(200)
      .render('home', { pizzas, cartId: '61c5d0687598edc302a1674e' });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

// exports
module.exports = {
  indexController,
};
