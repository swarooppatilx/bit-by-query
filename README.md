# Bit By Query

**Bit By Query** is a full-stack web platform where users can participate in SQL competitions. The system uses an **Express.js backend** with an **in-memory SQLite database** and a **React (Vite + Tailwind CSS)** frontend.

Users can:
- Compete by solving SQL challenges.
- Track their progress on leaderboards.
- Solve problems under time pressure with real-time countdowns.
- Register/login securely with hashed passwords.

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
├── LICENSE.md                 # MIT License
├── CODE_OF_CONDUCT.md         # Community guidelines
└── README.md                  # This file
````

---

## Tech Stack

* **Backend:** Node.js, Express, SQLite
* **Frontend:** React, Vite, Tailwind CSS
* **Auth:** JWT, bcrypt
* **Database Layer:** In-memory SQLite
* **Utilities:** MySQL to SQLite query parser

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/swarooppatilx/bit-by-query.git
cd bit-by-query
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 4. Run in Development Mode

This builds the frontend and starts the backend with live-reloading:

```bash
npm run local
```

* The backend runs on: **[http://localhost:5000](http://localhost:3000)**
* The frontend runs on: **[http://localhost:5173](http://localhost:5173)**

### 5. Run Frontend & Backend Separately

In separate terminals:

```bash
# Terminal 1: start backend
npm run dev

# Terminal 2:
cd client
npm run dev
```

### 6. Production Build

To build the frontend for production:

```bash
npm run build
```

Then run the backend:

```bash
npm start
```

---

## Environment Variables

Create a `.env` file in the root (MySQL credentials)

```env
DB_HOST=""
DB_NAME=""
DB_USER=""
DB_PASSWORD=""
```

---

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm start`     | Run backend server (production)    |
| `npm run dev`   | Run backend server with nodemon    |
| `npm run build` | Build frontend (React app)         |
| `npm run local` | Build frontend + start backend dev |

---

## License

[MIT](LICENSE) — Feel free to use, modify, and share!

---

## Acknowledgments

* Built with ❤️ by the IOIT ACM Web team.