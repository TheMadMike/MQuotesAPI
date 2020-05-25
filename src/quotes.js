const express = require('express');
const asyncHandler = require('express-async-handler');
const seedrandom = require('seedrandom');
const db = require('./db');

const router = express.Router();

router.get('/random', asyncHandler(async (request, response) => {
  const max = await db.getQuoteCount() - 1;
  const id = Math.floor(Math.random() * Math.floor(max)) + 1;
  const quote = await db.getQuoteById(id);

  response.json(quote);
}));

router.get('/daily', asyncHandler(async (request, response) => {
  const today = Date.now();
  const max = await db.getQuoteCount() - 1;
  // convert Date.now() from miliseconds to days and generate quote for each day
  const dailyId = Math.floor(seedrandom(Math.floor((today / 1000) / 3600) / 24)() * max) + 1;
  const quote = await db.getQuoteById(dailyId);
  response.json(quote);
}));

router.get('/:id', asyncHandler(async (request, response, next) => {
  try {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(request.params.id)) {
      const error = new Error('Bad request');
      error.status = 400;
      throw error;
    } else {
      const quote = await db.getQuoteById(request.params.id);
      response.json(quote);
    }
  } catch (error) {
    next(error);
  }
}));

module.exports = router;
