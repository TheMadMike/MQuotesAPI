const express = require('express');

const Database = require('./db');

const db = new Database();

const router = express.Router();

router.get('/random', async (request, response) => {
  const max = await db.getQuoteCount() - 1;
  const id = Math.floor(Math.random() * Math.floor(max)) + 1;
  const quote = await db.getQuoteById(id);

  response.json(quote);
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
    const quote = await db.getQuoteById(request.params.id);
    response.json(quote);
  }
});

module.exports = router;
