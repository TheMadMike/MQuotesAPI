const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120
});

const {
  name, description, version, author
} = require('../package.json');

const quotes = require('./quotes');

app.get('/', (request, response) => {
  response.json({
    name,
    description,
    version,
    author
  });
});

app.use('/', quotes);
app.use(limiter);

// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  response.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    }
  });
});

module.exports = app;
