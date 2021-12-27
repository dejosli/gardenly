// external imports
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

// internal imports
const {
  notFoundHandler,
  errorHandler,
} = require('./app/http/middleware/common/errorHandler');
const webRoutes = require('./routes/web');
const globalMiddleware = require('./app/http/middleware/common/globalMiddleware');
const {
  initLocalStrategy,
  initSerializeUser,
  initDeserializeUser,
} = require('./app/config/passport');

// init express app
const app = express();

// logger - morgan
const loggerFormat =
  process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(loggerFormat));

// db connection - mongodb
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected...');
  })
  .catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(err);
    }
    console.log('Database Connection Failed...');
  });

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// config session store
const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_CONNECTION_STRING,
  collectionName: 'sessions',
  crypto: {
    secret: process.env.MONGO_STORE_SECRET,
  },
});

// config session
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

// flash
app.use(flash());

// passport init
app.use(passport.initialize());
app.use(passport.session());
// passport config
passport.use(initLocalStrategy);
passport.serializeUser(initSerializeUser);
passport.deserializeUser(initDeserializeUser);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// set view engine
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// global middleware
app.use(globalMiddleware);

// routes setup
app.use('/', webRoutes);

// notfound handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

// init server
const PORT =
  process.env.PORT && process.env.NODE_ENV === 'production'
    ? process.env.PORT
    : 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
