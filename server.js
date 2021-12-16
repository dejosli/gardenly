// external imports
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// init express app
const app = express();

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set view engine
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// routes setup
app.get('/', (req, res) => {
  res.status(200).render('home');
});

app.get('/login', (req, res) => {
  res.status(200).render('auth/login');
});

app.get('/register', (req, res) => {
  res.status(200).render('auth/register');
});

app.get('/cart', (req, res) => {
  res.status(200).render('customers/cart');
});

// init server
const PORT =
  process.env.PORT && process.env.NODE_ENV === 'production'
    ? process.env.PORT
    : 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
