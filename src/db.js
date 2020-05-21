/* eslint-disable no-console */
const { Pool } = require('pg');

class Database {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }

  async query(queryString) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(queryString);
      const results = (result) ? result.rows : null;
      client.release();

      return results;
    } catch (error) {
      return null;
    }
  }

  async getQuoteById(id) {
    const quote = await this.query(`SELECT * FROM quotes WHERE id=${id}`);

    if (quote == null) {
      const error = new Error('Not found');
      error.status = 404;
      throw error;
    }

    quote[0].author = quote[0].author || 'Unknown';
    quote[0].author = quote[0].author.trim();
    quote[0].quote = quote[0].quote.trim();

    return quote[0];
  }

  async getQuoteCount() {
    const count = await this.query('SELECT id FROM quotes ORDER BY id DESC LIMIT 1');

    if (count == null) {
      throw new Error();
    }

    return count[0].id;
  }
}

module.exports = Database;
