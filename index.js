// external import
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

// internal import
const { server, router } = require('./server');
server();

const app = express();

// middleware
app.use(express.json());
app.use('/', router);

// view engine setup
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

app.get('/', (req, res) => {
  res.render('home');
});
