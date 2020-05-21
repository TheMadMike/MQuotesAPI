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

  async connect() {
    try {
      this.client = await this.pool.connect();
    } catch (error) {
      console.error(error);
    }
  }

  disconnect() {
    if (this.client !== undefined) {
      this.client.end();
    }
  }

  async query(queryString) {
    const result = await this.client.query(queryString);
    const results = (result) ? result.rows : null;
    return results;
  }

  async getQuoteById(id) {
    const quote = await this.query(`SELECT * FROM quotes WHERE id=${id}`);

    if (quote[0] === undefined) {
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
    return count[0].id;
  }
}

const db = new Database();

module.exports = db;
