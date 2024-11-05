# tax-analyser Database Schema - Postgres

SOme prisma useful cmds

npx prisma db push
npx prisma generate
npx prisma migrate dev --name init

## 0. Make sure you have all the database details in env file

## 1. Run the command in the postgres database to create table

`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20),
      status VARCHAR(20) CHECK(status IN ('active', 'inactive')) NOT NULL,
      plan_end_date DATE,
      db_prefix VARCHAR(20),
      password VARCHAR(255) NOT NULL
);`

`SELECT
    table_schema || '.' || table_name as show_tables
FROM
    information_schema.tables
WHERE
    table_type = 'BASE TABLE'
AND
    table_schema NOT IN ('pg_catalog', 'information_schema');`

`select column_name, data_type, character_maximum_length
 from INFORMATION_SCHEMA.COLUMNS where table_name ='table_name';`

### use below command to delete the table

`DROP TABLE IF EXISTS users;`

## 2. run server locally using ''npm run dev'' and run 'node src/lib/createInternalUser.js <username> <password>'

This will connect to the databse and create a user in the database with the given username and password. ALl the other values will be taken from file src/lib/db.js using function insertUserDB().

# tax-analyser Database Schema

# DB initialization

node src/db/initdb.js

# sceham and details in database

Generic User table
Generic Client type table

User specific client list table - Means with Prefix - 'anil_client'
Id - TFN - Client Type (Foreign key) - Client Name - Last year lodged

<!-- Generic table for year wise data

- Id - Year - Status - Due Date - TFN (Foreign key) - Prefix
ç
Or

-->

User specific table for year wise data - anil_tax_data
Id - Year - Status - Due Date - TFN (Foreign key)

      Users Table
      - Username
      - Id
      - Name
      - Email
      - Phone
      - Status - Membership active/inactive
      - Plan end date
      - DB Prefix - unique key, 'anil'
      -password
