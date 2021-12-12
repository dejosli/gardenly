// external imports
const dotenv = require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');

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

// routes setup
app.get('/', (req, res) => {
  res.render('home');
});

// init server
const PORT =
  process.env.PORT && process.env.NODE_ENV === 'production'
    ? process.env.PORT
    : 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
