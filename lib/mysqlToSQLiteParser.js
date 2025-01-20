const mysqlToSQLiteParser = (mysqlQuery) => {
  let sqliteQuery = mysqlQuery;

  // Step 0: Convert SQL syntax to uppercase
  const keywordsRegex =
    /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|FULL|OUTER|INNER|ON|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|DISTINCT|AS|AND|OR|NOT|NULL|IS|IN|BETWEEN|LIKE|CREATE|TABLE|PRIMARY KEY|FOREIGN KEY|REFERENCES|DEFAULT|AUTO_INCREMENT|ENGINE|CHARSET|CURRENT_TIMESTAMP|DATE|DATETIME|TIME|NOW|CURDATE|CURTIME|UUID|DATE_ADD|DATE_SUB|DATEDIFF|YEAR|MONTH|DAY|HOUR|MINUTE|SECOND|LAST_DAY|WEEK|QUARTER|DAYOFWEEK|DAYOFYEAR|TIME_TO_SEC|SEC_TO_TIME|ALTER|DROP|TRUNCATE|INDEX|VIEW|UNION|ALL|EXISTS)\b/gi;

  sqliteQuery = sqliteQuery.replace(keywordsRegex, (match) =>
    match.toUpperCase()
  );

  // Step 1: Direct replacements for MySQL-specific syntax
  const replacements = [
    { regex: /AUTO_INCREMENT/g, replacement: "AUTOINCREMENT" },
    { regex: /ENGINE=\w+/g, replacement: "" },
    { regex: /DEFAULT CHARSET=\w+/g, replacement: "" },
    { regex: /`([^`]+)`/g, replacement: '"$1"' }, // Backticks to double quotes
    { regex: /CURRENT_TIMESTAMP\(\)/g, replacement: "CURRENT_TIMESTAMP" },
    { regex: /NOW\(\)/g, replacement: "CURRENT_TIMESTAMP" }, // For NOW()
    { regex: /CURDATE\(\)/g, replacement: "DATE('now')" }, // CURDATE()
    { regex: /CURTIME\(\)/g, replacement: "TIME('now')" }, // CURTIME()
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
      regex: /DATE_SUB\(([^,]+), INTERVAL ([^,]+) (\w+)\)/g,
      replacement: "DATETIME($1, '-$2 $3')",
    }, // DATE_SUB
    {
      regex: /DATEDIFF\(([^,]+), ([^)]+)\)/g,
      replacement: "(JULIANDAY($1) - JULIANDAY($2))",
    },
    // DATEDIFF
    { regex: /DATE\(([^)]+)\)/g, replacement: "DATE($1)" }, // DATE()
    { regex: /TIMESTAMP\(([^)]+)\)/g, replacement: "DATETIME($1)" }, // TIMESTAMP
    { regex: /YEAR\(([^)]+)\)/g, replacement: "strftime('%Y', $1)" }, // YEAR()
    { regex: /MONTH\(([^)]+)\)/g, replacement: "strftime('%m', $1)" }, // MONTH()
    { regex: /DAY\(([^)]+)\)/g, replacement: "strftime('%d', $1)" }, // DAY()
    { regex: /HOUR\(([^)]+)\)/g, replacement: "strftime('%H', $1)" }, // HOUR()
    { regex: /MINUTE\(([^)]+)\)/g, replacement: "strftime('%M', $1)" }, // MINUTE()
    { regex: /SECOND\(([^)]+)\)/g, replacement: "strftime('%S', $1)" }, // SECOND()
    {
      regex: /LAST_DAY\(([^)]+)\)/g,
      replacement: "DATE($1, 'start of month', '+1 month', '-1 day')",
    }, // LAST_DAY
    {
      regex: /WEEK\(([^,]+)(?:, (\d))?\)/g,
      replacement: "strftime('%W', $1)", // Simplified; assumes no mode handling
    }, // WEEK
    {
      regex: /QUARTER\(([^)]+)\)/g,
      replacement: "(CAST(strftime('%m', $1) AS INTEGER) + 2) / 3",
    }, // QUARTER
    {
      regex: /DAYOFWEEK\(([^)]+)\)/g,
      replacement: "strftime('%w', $1) + 1",
    }, // DAYOFWEEK (Sunday = 1)
    {
      regex: /DAYOFYEAR\(([^)]+)\)/g,
      replacement: "strftime('%j', $1)",
    }, // DAYOFYEAR
    {
      regex: /TIME_TO_SEC\(([^)]+)\)/g,
      replacement:
        "(strftime('%H', $1) * 3600 + strftime('%M', $1) * 60 + strftime('%S', $1))",
    }, // TIME_TO_SEC
    {
      regex: /SEC_TO_TIME\((\d+)\)/g,
      replacement: "strftime('%H:%M:%S', $1, 'unixepoch')",
    }, // SEC_TO_TIME
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
