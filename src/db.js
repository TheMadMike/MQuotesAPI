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

  async getQuoteById(id) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(`SELECT * FROM quotes WHERE id=${id}`);
      const results = (result) ? result.rows : null;
      client.release();

      return results[0];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return null;
    }
  }
}

module.exports = Database;
