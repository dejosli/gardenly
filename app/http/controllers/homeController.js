// internal imports
const Menu = require('../../models/menu');

// render home
const indexController = async (req, res, next) => {
  try {
    const pizzas = await Menu.find();
    res.status(200).render('home', { pizzas });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

// exports
module.exports = {
  indexController,
};
