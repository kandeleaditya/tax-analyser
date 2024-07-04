var sql = require("better-sqlite3");
var db = sql("tax_analyser.db");
var createUserTableStmt =
  "\n   CREATE TABLE IF NOT EXISTS users (\n      id int unsigned AUTO_INCREMENT PRIMARY KEY,\n      username varchar(255) NOT NULL UNIQUE,\n      name varchar(255) NOT NULL,\n      email varchar(255) NOT NULL UNIQUE,\n      phone varchar(20),\n      status VARCHAR(20) CHECK(status IN ('active', 'inactive')) NOT NULL,\n      plan_end_date date,\n      DBPrefix varchar(20),\n      Password varchar(255) NOT NULL\n   )\n";
try {
  db.prepare(createUserTableStmt).run();
  console.log(
    "Users table created successfully (if it did not exist already)."
  );
} catch (error) {
  console.error("Error creating Users table:", error.message);
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
