import sql from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';

//const sql = require('better-sqlite3');
const db = sql('tax_analyser.db');

/* export async function insertUserDB(username, password) {
  // TODO: Add database connection

  const insertUserStmt = db.prepare(
    'INSERT INTO users (username, name, email, phone, status, plan_end_date, db_prefix, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  // const username = 'johndoe';
  // const password = 'hashed_password'; // Assuming the password is already hashed
  const name = 'John Doe';
  const email = 'johndoe1@example.com';
  const phone = '1234567890';
  const status = 'active';
  const plan_end_date = '2024-12-31'; // Date in YYYY-MM-DD format
  const db_prefix = 'user_';

  const result = insertUserStmt.run(username, name, email, phone, status, plan_end_date, db_prefix, password);

  if (result.changes !== 1) {
    console.error('User creation failed:', result);
  } else {
    console.log('User created successfully!');
  }
} */
/* 
export async function getUserDB(username) {
  const getUserStmt = db.prepare('SELECT * FROM users WHERE username = ?');

  const user = getUserStmt.get(username);

  if (user) {
    console.log('DB get user successful!', user);
  } else {
    console.log('DB get user failed.');
  }

  return user;
} */

/* export async function insertClientListData(clientList) {
  const insert = db.prepare(
    'INSERT OR REPLACE INTO client_list (client_type, client_name, tfn, last_year_lodged, db_prefix) VALUES (@ClientType, @ClientName, @TFN, @LastYearLodged, @db_prefix)'
  );

  const insertMany = db.transaction((clientList) => {
    for (const clientItem of clientList) insert.run(clientItem);
  });

  const result = insertMany(clientList);

  // if (result.changes !== 1) {
  //   console.error('Client list update failed:', result);
  // } else {
  //   console.log('Client list updated successfully!');
  // }
}
 */
/* export async function insertYearlyData(yearlyData) {
  const insert = db.prepare(
    'INSERT OR REPLACE INTO yearly_data (year, due_date, status, tfn, db_prefix) VALUES (@year, @DueDate, @status, @TFN, @db_prefix)'
  );

  const insertMany = db.transaction((yearlyData) => {
    for (const yearlyItem of yearlyData) insert.run(yearlyItem);
  });

  const result = insertMany(yearlyData);

  // if (result.changes !== 1) {
  //   console.error('Yearly data insertion failed:', result);
  // } else {
  //   console.log('Yearly data inserted successfully!');
  // }
} */

const prisma = new PrismaClient();

export async function insertUserDB(username, password) {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        name: 'John Doe',
        email: 'johndoe2@example.com',
        phone: '1234567890',
        status: 'active',
        planEndDate: '2024-12-31T00:00:00.000Z',
        dbPrefix: 'user_',
        password,
      },
    });
    console.log('User created successfully!');
  } catch (err) {
    console.error('Error creating user:', err);
  }
}

export async function getUserDB(username) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      console.log('DB get user successful!', user);
    } else {
      console.log('DB get user failed.');
    }
    return user;
  } catch (err) {
    console.error('Error retrieving user:', err);
    return null;
  }
}

export async function insertClientListData(data) {
  //console.log('adi db js clientList', data);
  try {
    const result = await prisma.clientList.createMany({
      data: data.map((item) => ({
        clientType: item.ClientType,
        clientName: item.ClientName,
        tfn: item.TFN.toString().trim(),
        lastYearLodged: item.LastYearLodged,
        dbPrefix: item.db_prefix,
      })),
    });
    console.log('Client list data inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting client list data:', error);
  }
}

export async function insertYearlyData(data) {
  //console.log('adi db js yearlyData', data);
  try {
    const result = await prisma.yearlyData.createMany({
      data: data.map((item) => {
        const [year, month, day] = item.DueDate.split('/');
        const dueDate = new Date(year, month - 1, day).toISOString();
        return {
          year: parseInt(item.year),
          dueDate: dueDate,
          status: item.status,
          tfn: item.TFN.toString().trim(),
          dbPrefix: item.db_prefix,
        };
      }),
    });
    console.log('Yearly data inserted successfully:', result);
  } catch (error) {
    console.error('Error inserting yearly data:', error);
  }
}
