/* eslint-disable no-console */
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const port = process.env.PORT || 8080;

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 120
});

const {
  name, description, version, author
} = require('./package.json');

const quotes = require('./src/quotes');

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

app.use((error, request, response) => {
  response.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
