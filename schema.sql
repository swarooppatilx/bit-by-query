-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

-- Submissions Table
CREATE TABLE submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  problem_id INT NOT NULL,
  timestamp INT DEFAULT NULL,
  name TEXT DEFAULT NULL,
  marks INT DEFAULT NULL
);
