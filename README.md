# Bit by Query - SQL Competition Platform

A full-stack SQL competition platform with a React frontend and Node.js backend.

## Project Structure

```
bit-by-query/
├── client/                 # React frontend application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend application
│   ├── server.js          # Main server file
│   ├── lib/               # Utility libraries
│   ├── data/              # Data and configuration files
│   │   ├── problems/      # SQL competition problems
│   │   ├── schema.sql     # Database schema
│   │   └── users.json     # User data
│   └── package.json       # Backend dependencies
├── package.json           # Root workspace configuration
└── README.md              # This file
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bit-by-query
   ```

2. **Install all dependencies**

   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server and frontend development server concurrently.

### Individual Commands

- **Start backend only**: `npm run dev:server`
- **Start frontend only**: `npm run dev:client`
- **Build frontend**: `npm run build`
- **Start production server**: `npm start`

## Development

### Backend (Server)

- Located in `server/` directory
- Express.js API server
- SQLite database for data persistence
- JWT authentication
- MySQL to SQLite query parser

### Frontend (Client)

- Located in `client/` directory
- React application with Vite
- Tailwind CSS for styling
- Responsive design

## Features

- SQL query competition platform
- User authentication and registration
- Real-time query execution
- Leaderboard system
- Problem management
- Mobile-responsive interface

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
