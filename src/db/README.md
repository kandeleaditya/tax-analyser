# tax-analyser Database Schema

Generic User table
Generic Client type table

User specific client list table - Means with Prefix
	- Id
	- TFN
	- Client Type (Foreign key)
	- Client Name
	- Last year lodged

Generic table for year wise data
	- Id
	- Year
	- Status
	- Due Date
	- TFN  (Foreign key)
	- Prefix
Or
User specific table for year wise data
	- Id
	- Year
	- Status
	- Due Date
	- TFN  (Foreign key)




    Users Table
	- Username
	- Id
	- Name
	- Email
	- Phone
	- Status - Membership active/inactive
	- Plan end date
	- DB Prefix
	-password