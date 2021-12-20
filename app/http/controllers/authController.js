// internal imports

// login
const loginController = (req, res) => {
  res.status(200).render('auth/login');
};

// register
const registerController = (req, res) => {
  res.status(200).render('auth/register');
};

// exports
module.exports = {
  loginController,
  registerController,
};
