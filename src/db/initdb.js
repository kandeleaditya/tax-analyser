const sql = require('better-sqlite3');
const db = sql('tax_analyser.db');

const createUserTableStmt = `
   CREATE TABLE IF NOT EXISTS users (
      id int unsigned AUTO_INCREMENT PRIMARY KEY,
      username varchar(255) NOT NULL UNIQUE,
      name varchar(255) NOT NULL,
      email varchar(255) NOT NULL UNIQUE,
      phone varchar(20),
      status VARCHAR(20) CHECK(status IN ('active', 'inactive')) NOT NULL,
      plan_end_date date,
      db_prefix varchar(20),
      password varchar(255) NOT NULL
   )`;

try {
  db.prepare(createUserTableStmt).run();
  console.log('Users table created successfully (if it did not exist already).');
} catch (error) {
  console.error('Error creating Users table:', error.message);
}
db.close();

/*

async function initData() {
  const stmt = db.prepare(`
      INSERT INTO meals VALUES (
         null,
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
   `);

  for (const meal of dummyMeals) {
    stmt.run(meal);
  }
}

initData();
 */
