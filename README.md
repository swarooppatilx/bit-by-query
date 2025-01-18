# Bit By Query

**Bit By Query** is a web-based platform where users can compete in SQL competitions. It offers a variety of challenges and a leaderboard to track participants' progress.

## Features

- **User Authentication**: Secure user registration and login.
- **SQL Challenges**: Solve curated SQL problems of varying difficulty.
- **Leaderboards**: Compete with others and see your ranking.
- **Real-time Countdown**: Timed challenges to keep the competition intense.

---

## Project Structure

```plaintext
.
├── client                     # Frontend code (React, Vite)
│   ├── dist                   # Build output
│   ├── src                    # Source files
│   │   ├── apiClient.js       # API interaction
│   │   ├── components         # Reusable React components
│   │   ├── hooks              # Custom hooks
│   │   ├── App.jsx            # Main app entry
│   │   ├── Home.jsx           # Home page
│   │   ├── LeaderBoard.jsx    # Leaderboard component
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── middleware.jsx     # Middleware for route protection
│   │   └── NotFound.jsx       # 404 error page
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── vite.config.js         # Vite configuration
├── server.js                  # Backend server (Node.js, Express)
├── schema.sql                 # Database schema
├── lib                        # Utility scripts
│   └── mysqlToSQLiteParser.js # Converts MySQL queries to SQLite
├── problems                   # JSON files containing challenges
│   ├── jan2025.json           # Example problem set
│   └── virtual_contest.json   # Virtual contest problem set
├── users.json                 # Sample user data
├── hashPassword.js            # Password hashing utility
└── README.md                  # Project documentation
```