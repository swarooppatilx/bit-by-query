# Server - Backend API

This directory contains the Node.js backend server for the Bit by Query SQL competition platform.

## Structure

```
server/
├── server.js              # Main Express server
├── lib/                   # Utility libraries
│   └── mysqlToSQLiteParser.js
├── data/                  # Data and configuration files
│   ├── problems/          # SQL competition problems
│   │   ├── jan2025.json
│   │   └── virtual_contest.json
│   ├── schema.sql         # Database schema
│   └── users.json         # User data
├── scripts/               # Utility scripts
│   ├── hashPassword.js    # Password hashing utility
│   ├── init-db.js         # Database initialization
│   └── README.md          # Scripts documentation
└── package.json           # Dependencies
```

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Start production server**

   ```bash
   npm start
   ```

4. **Available scripts**
   ```bash
   npm run hash-password <password>  # Hash a password
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Problems

- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get specific problem
- `POST /api/problems/:id/submit` - Submit solution

### Leaderboard

- `GET /api/leaderboard` - Get leaderboard data

## Database

The server uses SQLite for data persistence with the following features:

- In-memory database for fast queries
- Schema defined in `schema.sql`
- MySQL to SQLite query parser for compatibility

## Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

## Dependencies

- **express** - Web framework
- **sqlite3** - SQLite database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **body-parser** - Request body parsing
- **mysql2** - MySQL compatibility layer
