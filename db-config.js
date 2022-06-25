const Pool = require('pg').Pool
const pool = new Pool({
  user: 'alex',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

module.exports = {pool};