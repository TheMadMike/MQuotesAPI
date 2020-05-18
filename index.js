/* eslint-disable no-console */
const express = require('express');

const app = express();

const port = process.env.PORT || 8080;

const {
  name, description, version, author
} = require('./package.json');

app.get('/', (request, response) => {
  response.json({
    name,
    description,
    version,
    author
  });
});

app.listen(port, () => console.log(`Listening on port ${port}...`));
