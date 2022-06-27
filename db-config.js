const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'alex',
//   host: 'localhost',
//   database: 'postgres',
//   password: 'password',
//   port: 5432,
// });

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: {
     rejectUnauthorized: false
   }
 });
 
module.exports = {pool};