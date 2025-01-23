//This is a cli script that takes a password as an argument and hashes it using bcrypt.
const bcrypt = require("bcrypt");

// Get password from the command line arguments
const password = process.argv[2];

// Check if the password is provided
if (!password) {
  // console.log("Please provide a password as an argument.");
  process.exit(1);
}

// Hash the password with bcrypt
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    process.exit(1);
  }

  // Print the hashed password
  // console.log("Hashed password:", hash);
});
