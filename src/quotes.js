const express = require('express');
const asyncHandler = require('express-async-handler');
const db = require('./db');

const router = express.Router();

let dailyId = 1;

const today = Date.now();

function isNextDay() {
  let elapsed = Date.now() - today;
  elapsed = Math.floor(elapsed / 1000);
  elapsed = Math.floor(elapsed / 3600);

  return (elapsed >= 24);
}

router.get('/random', asyncHandler(async (request, response) => {
  const max = await db.getQuoteCount() - 1;
  const id = Math.floor(Math.random() * Math.floor(max)) + 1;
  const quote = await db.getQuoteById(id);

  response.json(quote);
}));

router.get('/daily', asyncHandler(async (request, response) => {
  if (isNextDay() || (dailyId === 1)) {
    const max = await db.getQuoteCount() - 1;
    dailyId = Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  const quote = await db.getQuoteById(dailyId);
  response.json(quote);
}));

router.get('/:id', asyncHandler(async (request, response) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(request.params.id)) {
    const error = new Error('Bad request');
    error.status = 400;
    throw error;
  } else {
    const quote = await db.getQuoteById(request.params.id);
    response.json(quote);
  }
}));

module.exports = router;
