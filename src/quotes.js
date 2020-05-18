const express = require('express');

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

router.get('/:id', (request, response) => {
  response.json({
    quote: `quote no. ${request.params.id}`,
    author: 'Unknown'
  });
});

module.exports = router;
