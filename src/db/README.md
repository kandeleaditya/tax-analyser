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
