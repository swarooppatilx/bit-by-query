// Custom MySQL to SQLite Syntax Parser

const mysqlToSQLiteParser = (mysqlQuery) => {
  let sqliteQuery = mysqlQuery;

  // Step 1: Mapping for direct replacements
  const replacements = [
    { regex: /AUTO_INCREMENT/g, replacement: "AUTOINCREMENT" },
    { regex: /ENGINE=\w+/g, replacement: "" },
    { regex: /DEFAULT CHARSET=\w+/g, replacement: "" },
    { regex: /`([^`]+)`/g, replacement: '"$1"' }, // Backticks to double quotes
    { regex: /CURRENT_TIMESTAMP\(\)/g, replacement: "CURRENT_TIMESTAMP" },
  ];

  // Step 2: Mapping for type conversions
  const typeMappings = [
    {
      regex: /\b(INT|TINYINT|SMALLINT|MEDIUMINT|BIGINT)\(\d+\)/g,
      replacement: "INTEGER",
    },
    { regex: /\b(DOUBLE|FLOAT|DECIMAL\(\d+,\d+\))\b/g, replacement: "REAL" },
    { regex: /\b(VARCHAR|CHAR|TEXT)\(\d+\)/g, replacement: "TEXT" },
  ];

  // Step 3: Special case for LIMIT OFFSET syntax
  const specialCases = [
    { regex: /LIMIT (\d+), (\d+)/g, replacement: "LIMIT $2 OFFSET $1" },
  ];

  // Apply replacements
  replacements.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  // Apply type mappings
  typeMappings.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  // Apply special cases
  specialCases.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  return sqliteQuery;
};

module.exports = mysqlToSQLiteParser;
