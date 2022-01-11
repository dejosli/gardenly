// external imports
require('dotenv').config();
const http = require('http');
const path = require('path');
const compression = require('compression');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

// internal imports
const {
  logger,
  morganMiddleware,
} = require('./app/http/middleware/common/logger');
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

// create express app
const app = express();

// init helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Compress all HTTP responses
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // Will not compress responses, if this header is present
    return false;
  }
  // Resort to standard compression
  return compression.filter(req, res);
};

app.use(
  compression({
    // filter: Decide if the answer should be compressed or not,
    // depending on the 'shouldCompress' function above
    filter: shouldCompress,
    // threshold: It is the byte threshold for the response
    // body size before considering compression, the default is 1 kB
    threshold: 0,
  })
);

// apply morgan middleware
app.use(morganMiddleware);

// db connection - mongodb
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.debug('MongoDB Connection Established');
  })
  .catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug(err);
    }
    logger.debug('MongoDB Connection Failed');
  });

// request parsers
app.use(express.json({ limit: '1kb' }));
app.use(express.urlencoded({ extended: true, limit: '1kb' }));

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
    name: process.env.SESSION_NAME,
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: 'strict' }, // 24 hours
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

// init port
const PORT =
  process.env.PORT && process.env.NODE_ENV === 'production'
    ? process.env.PORT
    : 3000;

// init server
const server = http.createServer(app);
server.listen(PORT, () => {
  logger.debug(`Server listening at http://localhost:${PORT}`);
});
