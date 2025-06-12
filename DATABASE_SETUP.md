# Climate Awareness Portal - Database Setup

This document provides instructions for setting up and populating the MongoDB database for the Climate Awareness Portal.

## Prerequisites

- MongoDB installed and running (local or remote)
- Node.js and npm installed

## Configuration

1. Make sure your MongoDB connection string is properly configured in the `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/climate_portal
```

## Seeding the Database

We've provided a convenient script to populate the database with sample data. This will create:

- Admin and test user accounts
- Sample initiatives
- Sample articles
- Sample activities
- Sample comments

### Option 1: Using the Batch Script (Windows)

1. Run the `seed-database.bat` script from the project root:

```
seed-database.bat
```

2. Confirm when prompted to proceed with database seeding.

### Option 2: Using Node.js Directly

1. Navigate to the backend directory:

```
cd backend
```

2. Run the seed script:

```
node seed-all-data.js
```

## Login Credentials

After seeding the database, you can log in with the following credentials:

### Admin User
- Email: admin@portal.com
- Password: admin123

### Test User
- Email: testuser@portal.com
- Password: test123

## Database Structure

The database contains the following collections:

- **Users**: User accounts including admins and regular users
- **Initiatives**: Climate action initiatives and events
- **Articles**: Educational articles about climate change
- **Activities**: User activities and actions
- **Comments**: User comments and feedback

## Manual Database Operations

If you need to perform manual operations on the database:

### Connect to MongoDB Shell

```
mongo climate_portal
```

### View Collections

```
show collections
```

### Query Examples

Count users:
```
db.users.count()
```

Find admin users:
```
db.users.find({role: "admin"})
```

Find recent activities:
```
db.activities.find().sort({date: -1}).limit(10)
```

## Troubleshooting

If you encounter issues with database seeding:

1. Make sure MongoDB is running
2. Check your connection string in the `.env` file
3. Ensure you have proper permissions to access the database
4. Check the console output for specific error messages

For further assistance, please contact the development team.