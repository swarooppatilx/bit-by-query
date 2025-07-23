#!/usr/bin/env node

/**
 * Password hashing utility script
 * Usage: node hashPassword.js <password>
 */

const bcrypt = require("bcrypt");

// Get password from the command line arguments
const password = process.argv[2];

// Check if the password is provided
if (!password) {
  console.log("Please provide a password as an argument.");
  console.log("Usage: node hashPassword.js <password>");
  process.exit(1);
}

// Hash the password with bcrypt
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    process.exit(1);
  }

  // Print the hashed password
  console.log("Hashed password:", hash);
});
