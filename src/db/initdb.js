import sql from 'better-sqlite3';

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

const createClientListTableStmt = `
   CREATE TABLE IF NOT EXISTS client_list (
      id int unsigned AUTO_INCREMENT PRIMARY KEY,
      client_type varchar(255) NOT NULL,
      client_name varchar(255) NOT NULL,
      tfn varchar(20) NOT NULL UNIQUE,
      last_year_lodged int,
      db_prefix varchar(20)
   )`;

const createYearlyDataTableStmt = `
   CREATE TABLE IF NOT EXISTS yearly_data (
      id int unsigned AUTO_INCREMENT PRIMARY KEY,
      year int,
      due_date date,
      status VARCHAR(20) CHECK(status IN ('Received', 'Not Received', 'Not Required', 'Return Not Necessary')) NOT NULL,
      tfn varchar(20) NOT NULL,
      db_prefix varchar(20),
      CONSTRAINT Unique_year_tfn UNIQUE (year, tfn)
   )`;

try {
  db.prepare(createUserTableStmt).run();
  db.prepare(createClientListTableStmt).run();
  db.prepare(createYearlyDataTableStmt).run();
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
