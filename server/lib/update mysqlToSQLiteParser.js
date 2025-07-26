const parser = require('./mysqlToSQLiteParser');

// Helper function to test parser
function testParser(category, description, mysqlQuery, expectedSqliteQuery) {
    console.log(`\n=== ${category}: ${description} ===`);
    console.log('MySQL:   ', mysqlQuery);
    const result = parser(mysqlQuery);
    console.log('SQLite:  ', result);
    console.log('Expected:', expectedSqliteQuery);
    const passed = result.trim() === expectedSqliteQuery.trim();
    console.log('Status:  ', passed ? '✓ PASS' : '✗ FAIL');
    if (!passed) {
        console.log('\nDifferences:');
        console.log('Got:     ', result.trim());
        console.log('Expected:', expectedSqliteQuery.trim());
    }
    return passed;
}

let totalTests = 0;
let passedTests = 0;

// 1. String Functions
console.log('\n=== String Function Tests ===');

// Basic string operations
passedTests += testParser('String', 'CONCAT',
    "SELECT CONCAT(first_name, ' ', last_name) FROM users;",
    "SELECT first_name || ' ' || last_name FROM users;"
) ? 1 : 0;
totalTests++;

passedTests += testParser('String', 'SUBSTRING with 2 params',
    "SELECT SUBSTRING(name, 1) FROM users;",
    "SELECT substr(name, 1) FROM users;"
) ? 1 : 0;
totalTests++;

passedTests += testParser('String', 'SUBSTRING with 3 params',
    "SELECT SUBSTRING(name, 1, 3) FROM users;",
    "SELECT substr(name, 1, 3) FROM users;"
) ? 1 : 0;
totalTests++;

// Advanced string operations
passedTests += testParser('String', 'Complex string manipulation',
    "SELECT UPPER(SUBSTRING(CONCAT(first_name, ' ', last_name), 1, 10)) FROM users;",
    "SELECT UPPER(substr(first_name || ' ' || last_name, 1, 10)) FROM users;"
) ? 1 : 0;
totalTests++;

// 2. Date/Time Functions
console.log('\n=== Date/Time Function Tests ===');

passedTests += testParser('DateTime', 'Basic date functions',
    "SELECT DATE_ADD(created_at, INTERVAL 7 DAY), YEAR(birth_date) FROM users;",
    "SELECT DATETIME(created_at, '+7 DAY'), CAST(strftime('%Y', birth_date) AS INTEGER) FROM users;"
) ? 1 : 0;
totalTests++;

passedTests += testParser('DateTime', 'Complex date manipulation',
    "SELECT DATEDIFF(end_date, start_date), LAST_DAY(current_date) FROM events;",
    "SELECT CAST((JULIANDAY(end_date) - JULIANDAY(start_date)) AS INTEGER), DATE(current_date, 'start of month', '+1 month', '-1 day') FROM events;"
) ? 1 : 0;
totalTests++;

// 3. Mathematical Functions
console.log('\n=== Mathematical Function Tests ===');

passedTests += testParser('Math', 'Basic math functions',
    "SELECT CEIL(price), FLOOR(rating), ROUND(score, 2) FROM products;",
    "SELECT CAST(ROUND(price + 0.5) AS INTEGER), CAST(rating AS INTEGER), ROUND(score, 2) FROM products;"
) ? 1 : 0;
totalTests++;

passedTests += testParser('Math', 'Advanced math operations',
    "SELECT POW(base, 2), MOD(total, 2), SQRT(area) FROM measurements;",
    "SELECT POWER(base, 2), (total % 2), SQRT(area) FROM measurements;"
) ? 1 : 0;
totalTests++;

// 4. Aggregate Functions
console.log('\n=== Aggregate Function Tests ===');

passedTests += testParser('Aggregate', 'Basic aggregation',
    "SELECT COUNT(DISTINCT id), SUM(amount), AVG(price) FROM orders;",
    "SELECT COUNT(DISTINCT id), SUM(amount), AVG(price) FROM orders;"
) ? 1 : 0;
totalTests++;

passedTests += testParser('Aggregate', 'GROUP_CONCAT with ORDER BY',
    "SELECT department, GROUP_CONCAT(name ORDER BY salary DESC) FROM employees GROUP BY department;",
    "SELECT department, GROUP_CONCAT(name) FROM employees GROUP BY department;"
) ? 1 : 0;
totalTests++;

// 5. Conditional Expressions
console.log('\n=== Conditional Expression Tests ===');

passedTests += testParser('Conditional', 'Basic conditions',
    "SELECT IF(age > 18, 'Adult', 'Minor'), IFNULL(manager_id, 0) FROM employees;",
    "SELECT CASE WHEN age > 18 THEN 'Adult' ELSE 'Minor' END, COALESCE(manager_id, 0) FROM employees;"
) ? 1 : 0;
totalTests++;

passedTests += testParser('Conditional', 'Complex CASE expression',
    `SELECT 
        CASE 
            WHEN salary > 100000 THEN 'High'
            WHEN salary > 50000 THEN 'Medium'
            ELSE 'Low'
        END as salary_bracket
    FROM employees;`,
    `SELECT 
        CASE 
            WHEN salary > 100000 THEN 'High'
            WHEN salary > 50000 THEN 'Medium'
            ELSE 'Low'
        END as salary_bracket
    FROM employees;`
) ? 1 : 0;
totalTests++;

// 6. Table Creation and Schema
console.log('\n=== Schema Tests ===');

passedTests += testParser('Schema', 'Create table with constraints',
    `CREATE TABLE users (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,
    `CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`
) ? 1 : 0;
totalTests++;

// 7. Complex Queries
console.log('\n=== Complex Query Tests ===');

passedTests += testParser('Complex', 'Joins with subquery and aggregation',
    `SELECT 
        d.name as dept_name,
        COUNT(DISTINCT e.id) as emp_count,
        GROUP_CONCAT(DISTINCT e.name ORDER BY e.salary DESC) as emp_names,
        ROUND(AVG(e.salary), 2) as avg_salary
    FROM departments d
    LEFT JOIN employees e ON d.id = e.dept_id
    WHERE e.salary > (SELECT AVG(salary) FROM employees)
    GROUP BY d.id
    HAVING COUNT(*) > 5
    ORDER BY avg_salary DESC
    LIMIT 10;`,
    `SELECT 
        d.name as dept_name,
        COUNT(DISTINCT e.id) as emp_count,
        GROUP_CONCAT(DISTINCT e.name) as emp_names,
        ROUND(AVG(e.salary), 2) as avg_salary
    FROM departments d
    LEFT OUTER JOIN employees e ON d.id = e.dept_id
    WHERE e.salary > (SELECT AVG(salary) FROM employees)
    GROUP BY d.id
    HAVING COUNT(*) > 5
    ORDER BY avg_salary DESC
    LIMIT 10;`
) ? 1 : 0;
totalTests++;

// Print summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${passedTests}/${totalTests} tests`);
console.log(`Status: ${passedTests === totalTests ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);

// Export test results
module.exports = {
    totalTests,
    passedTests,
    allPassed: passedTests === totalTests
};
