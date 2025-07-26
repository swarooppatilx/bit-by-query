-- SQLite schema for bit-by-query

PRAGMA foreign_keys = ON;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS users;

-- Table structure for table users (create users first for foreign key reference)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at INTEGER DEFAULT CURRENT_TIMESTAMP
);

-- Create index for users
CREATE INDEX idx_users_username ON users(username);

-- Table structure for table submissions
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    problem_id INTEGER NOT NULL,
    timestamp INTEGER DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    marks INTEGER NOT NULL,
    FOREIGN KEY(username) REFERENCES users(username)
);

-- Create indices for submissions
CREATE INDEX idx_submissions_username ON submissions(username);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
