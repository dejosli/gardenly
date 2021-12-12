// external imports
const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();

const app = express();

// port setup
const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

// server setup
const server = () => {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
};

// exports
module.exports = {
  server,
  router,
};
