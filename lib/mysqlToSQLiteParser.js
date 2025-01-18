const mysqlToSQLiteParser = (mysqlQuery) => {
  let sqliteQuery = mysqlQuery;

  // Step 1: Direct replacements for MySQL-specific syntax
  const replacements = [
    { regex: /AUTO_INCREMENT/g, replacement: "AUTOINCREMENT" },
    { regex: /ENGINE=\w+/g, replacement: "" },
    { regex: /DEFAULT CHARSET=\w+/g, replacement: "" },
    { regex: /`([^`]+)`/g, replacement: '"$1"' }, // Backticks to double quotes
    { regex: /CURRENT_TIMESTAMP\(\)/g, replacement: "CURRENT_TIMESTAMP" },
    { regex: /NOW\(\)/g, replacement: "CURRENT_TIMESTAMP" }, // For NOW()
    { regex: /CURDATE\(\)/g, replacement: "DATE('now')" }, // CURDATE()
    { regex: /UUID\(\)/g, replacement: "LOWER(HEX(RANDOMBLOB(16)))" }, // UUID()
  ];

  // Step 2: Type conversions for MySQL data types
  const typeMappings = [
    {
      regex: /\b(INT|TINYINT|SMALLINT|MEDIUMINT|BIGINT)\(\d+\)/g,
      replacement: "INTEGER",
    },
    { regex: /\b(DOUBLE|FLOAT|DECIMAL\(\d+,\d+\))\b/g, replacement: "REAL" },
    { regex: /\b(VARCHAR|CHAR|TEXT)\(\d+\)/g, replacement: "TEXT" },
    { regex: /\b(TINYINT)\b/g, replacement: "INTEGER" }, // MySQL TINYINT to INTEGER
    { regex: /\b(BLOB)\b/g, replacement: "BLOB" }, // MySQL BLOB stays the same
  ];

  // Step 3: Special handling for SQL functions and expressions
  const functionMappings = [
    {
      regex: /DATE_ADD\(([^,]+), INTERVAL ([^,]+) (\w+)\)/g,
      replacement: "DATETIME($1, '+$2 $3')",
    }, // DATE_ADD
    {
      regex: /DATEDIFF\(([^,]+), ([^)]+)\)/g,
      replacement: "JULIANDAY($1) - JULIANDAY($2)",
    }, // DATEDIFF
    { regex: /DATE\(([^)]+)\)/g, replacement: "DATE($1)" }, // DATE()
    { regex: /TIMESTAMP\(([^)]+)\)/g, replacement: "DATETIME($1)" }, // TIMESTAMP
    { regex: /YEAR\(([^)]+)\)/g, replacement: "strftime('%Y', $1)" }, // YEAR()
    { regex: /MONTH\(([^)]+)\)/g, replacement: "strftime('%m', $1)" }, // MONTH()
    { regex: /DAY\(([^)]+)\)/g, replacement: "strftime('%d', $1)" }, // DAY()
    { regex: /HOUR\(([^)]+)\)/g, replacement: "strftime('%H', $1)" }, // HOUR()
    { regex: /MINUTE\(([^)]+)\)/g, replacement: "strftime('%M', $1)" }, // MINUTE()
    { regex: /SECOND\(([^)]+)\)/g, replacement: "strftime('%S', $1)" }, // SECOND()
  ];

  // Step 4: Special case for LIMIT OFFSET syntax
  const specialCases = [
    { regex: /LIMIT (\d+), (\d+)/g, replacement: "LIMIT $2 OFFSET $1" },
    { regex: /LIMIT (\d+)/g, replacement: "LIMIT $1" }, // Handle cases without OFFSET
  ];

  // Step 5: Handle MySQL's JOIN conditions (if needed)
  const joinMappings = [
    { regex: /\bJOIN\b/g, replacement: "INNER JOIN" }, // Ensure JOIN is INNER JOIN in SQLite
    { regex: /\bLEFT JOIN\b/g, replacement: "LEFT OUTER JOIN" }, // LEFT JOIN
    { regex: /\bRIGHT JOIN\b/g, replacement: "RIGHT OUTER JOIN" }, // RIGHT JOIN
    { regex: /\bFULL JOIN\b/g, replacement: "FULL OUTER JOIN" }, // FULL JOIN (SQLite doesn't support full outer joins, needs workaround)
  ];

  // Apply all direct replacements
  replacements.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  // Apply type mappings
  typeMappings.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  // Apply function mappings
  functionMappings.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  // Apply special cases for LIMIT OFFSET
  specialCases.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  // Apply JOIN mapping
  joinMappings.forEach(({ regex, replacement }) => {
    sqliteQuery = sqliteQuery.replace(regex, replacement);
  });

  // Return the final SQLite query
  return sqliteQuery;
};

module.exports = mysqlToSQLiteParser;
