import { hashUserPassword } from './password.js';
import { insertUserDB } from './db.js';

function createInternalUser(username, password) {
  const hashedPassword = hashUserPassword(password);

  insertUserDB(username, hashedPassword);
}

console.log(process.argv);

// Get arguments from process.argv
const username = process.argv[2];
const password = process.argv[3];

createInternalUser(username, password);
