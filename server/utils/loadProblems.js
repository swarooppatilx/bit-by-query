const fs = require("fs");
const path = require("path");

module.exports = function loadProblems() {
  const filePath = path.join(__dirname, "..", "data", "problems", "aug2025.json");
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  console.error("Problems file not found.");
  return [];
};