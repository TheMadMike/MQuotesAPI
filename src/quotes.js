const express = require('express');

const Database = require('./db');

const db = new Database();

const router = express.Router();

router.get('/random', (request, response) => {
  response.json({
    quote: 'Random quote',
    author: 'Unknown'
  });
});

router.get('/daily', (request, response) => {
  response.json({
    quote: 'Quote of the day',
    author: 'Unknown'
  });
});

router.get('/:id', async (request, response) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(request.params.id)) {
    response.status(400);
    response.send(`Error: ${response.statusCode}`);
  } else {
    db.getQuoteById(request.params.id).then((quote) => {
      response.json(quote);
    });
  }
});

module.exports = router;
