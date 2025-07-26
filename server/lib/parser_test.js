const parser = require('./mysqlToSQLiteParser');

function testParser(description, mysqlQuery, expectedSqliteQuery) {
    console.log(`\n=== Test: ${description} ===`);
    console.log('MySQL:');
    console.log(mysqlQuery);
    console.log('\nSQLite:');
    const result = parser(mysqlQuery);
    console.log(result);
    console.log('\nExpected:');
    console.log(expectedSqliteQuery);
    const passed = result.trim() === expectedSqliteQuery.trim();
    console.log('\nStatus:', passed ? '✓ PASS' : '✗ FAIL');
    if (!passed) {
        console.log('\nDifferences:');
        console.log('Got:     ', result.trim());
        console.log('Expected:', expectedSqliteQuery.trim());
    }
    return passed;
}

let totalTests = 0;
let passedTests = 0;

// Test 1: Basic SELECT with string functions
passedTests += testParser(
    "String Functions",
    "SELECT CONCAT(first_name, ' ', last_name) as name, SUBSTRING(email, 1, 10) as email FROM users;",
    "SELECT first_name || ' ' || last_name as name, substr(email, 1, 10) as email FROM users;"
) ? 1 : 0;
totalTests++;

// Test 2: Date functions
passedTests += testParser(
    "Date Functions",
    "SELECT DATE_ADD(created_at, INTERVAL 7 DAY), YEAR(birth_date) FROM employees;",
    "SELECT DATETIME(created_at, '+7 DAY'), CAST(strftime('%Y', birth_date) AS INTEGER) FROM employees;"
) ? 1 : 0;
totalTests++;

// Test 3: Mathematical functions
passedTests += testParser(
    "Math Functions",
    "SELECT CEIL(price), FLOOR(rating), ROUND(score, 2) FROM products;",
    "SELECT CAST(ROUND(price + 0.5) AS INTEGER), CAST(rating AS INTEGER), ROUND(score, 2) FROM products;"
) ? 1 : 0;
totalTests++;

// Test 4: Conditional expressions
passedTests += testParser(
    "Conditional Expressions",
    "SELECT IF(age > 18, 'Adult', 'Minor'), IFNULL(manager_id, 0) FROM employees;",
    "SELECT CASE WHEN age > 18 THEN 'Adult' ELSE 'Minor' END, COALESCE(manager_id, 0) FROM employees;"
) ? 1 : 0;
totalTests++;

// Test 5: Aggregate functions
passedTests += testParser(
    "Aggregate Functions",
    "SELECT department, COUNT(DISTINCT id), GROUP_CONCAT(name ORDER BY name ASC) FROM employees GROUP BY department;",
    "SELECT department, COUNT(DISTINCT id), GROUP_CONCAT(name) FROM employees GROUP BY department;"
) ? 1 : 0;
totalTests++;

// Test 6: JOINs
passedTests += testParser(
    "JOIN Operations",
    "SELECT e.*, d.name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id;",
    "SELECT e.*, d.name FROM employees e LEFT OUTER JOIN departments d ON e.dept_id = d.id;"
) ? 1 : 0;
totalTests++;

// Test 7: Complex query
passedTests += testParser(
    "Complex Query",
    `SELECT 
    d.name as dept_name,
    COUNT(DISTINCT e.id) as emp_count,
    GROUP_CONCAT(DISTINCT e.name ORDER BY e.salary DESC) as emp_names,
    ROUND(AVG(e.salary), 2) as avg_salary,
    IF(COUNT(*) > 10, 'Large', 'Small') as dept_size
FROM departments d
LEFT JOIN employees e ON d.id = e.dept_id
WHERE YEAR(e.hire_date) = 2023
GROUP BY d.id
HAVING avg_salary > 50000
ORDER BY emp_count DESC
LIMIT 10;`,
    `SELECT 
    d.name as dept_name,
    COUNT(DISTINCT e.id) as emp_count,
    GROUP_CONCAT(DISTINCT e.name) as emp_names,
    ROUND(AVG(e.salary), 2) as avg_salary,
    CASE WHEN COUNT(*) > 10 THEN 'Large' ELSE 'Small' END as dept_size
FROM departments d
LEFT OUTER JOIN employees e ON d.id = e.dept_id
WHERE CAST(strftime('%Y', e.hire_date) AS INTEGER) = 2023
GROUP BY d.id
HAVING avg_salary > 50000
ORDER BY emp_count DESC
LIMIT 10;`
) ? 1 : 0;
totalTests++;

// Test 8: Table creation
passedTests += testParser(
    "Table Creation",
    `CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    `CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
) ? 1 : 0;
totalTests++;

console.log(`\n=== Test Summary ===`);
console.log(`Passed: ${passedTests}/${totalTests} tests`);
console.log(`Status: ${passedTests === totalTests ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);
