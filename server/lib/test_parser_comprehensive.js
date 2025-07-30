const parser = require('./mysqlToSQLiteParser');

// Test 1: String Functions
const test1 = `
SELECT 
    CONCAT(first_name, ' ', last_name) as full_name,
    SUBSTRING(email, 1, 10) as email_start,
    UPPER(department) as dept_upper,
    LENGTH(phone) as phone_length,
    REPLACE(address, 'St.', 'Street') as full_address,
    TRIM(notes) as clean_notes
FROM users;
`;

// Test 2: Date Functions
const test2 = `
SELECT 
    DATE_ADD(created_at, INTERVAL 7 DAY) as week_later,
    DATE_SUB(end_date, INTERVAL 1 MONTH) as month_before,
    YEAR(birth_date) as birth_year,
    MONTH(hire_date) as hire_month,
    DAY(start_date) as start_day,
    DATEDIFF(end_date, start_date) as days_diff,
    LAST_DAY(current_date) as month_end,
    DAYOFWEEK(event_date) as weekday,
    QUARTER(report_date) as current_quarter
FROM employees;
`;

// Test 3: Conditional and Mathematical Functions
const test3 = `
SELECT 
    IF(age > 18, 'Adult', 'Minor') as age_group,
    CEIL(salary) as rounded_salary,
    FLOOR(rating) as min_rating,
    ROUND(score, 2) as rounded_score,
    IFNULL(manager_id, 0) as safe_manager_id,
    POWER(base_value, 2) as squared_value,
    MOD(total, 2) as is_odd,
    ABS(difference) as absolute_diff,
    SQRT(area) as side_length,
    RAND() as random_value
FROM employees;
`;

// Test 4: Aggregate Functions
const test4 = `
SELECT 
    department,
    COUNT(DISTINCT employee_id) as emp_count,
    AVG(salary) as avg_salary,
    GROUP_CONCAT(DISTINCT role ORDER BY role ASC) as roles,
    SUM(bonus) as total_bonus,
    MIN(hire_date) as earliest_hire,
    MAX(salary) as highest_salary
FROM employees 
GROUP BY department
HAVING COUNT(*) > 5 AND AVG(salary) > 50000
ORDER BY avg_salary DESC;
`;

// Test 5: Complex Joins and Subqueries
const test5 = `
SELECT 
    e.name,
    d.department_name,
    COALESCE(p.project_name, 'No Project') as project,
    CASE 
        WHEN e.salary > 100000 THEN 'High'
        WHEN e.salary > 50000 THEN 'Medium'
        ELSE 'Low'
    END as salary_bracket
FROM 
    employees e
    LEFT JOIN departments d ON e.dept_id = d.id
    LEFT JOIN projects p ON e.project_id = p.id
WHERE 
    e.salary > (SELECT AVG(salary) FROM employees)
    AND d.location IN ('NY', 'SF', 'LA')
LIMIT 10;
`;

// Test 6: Data Types and Table Creation
const test6 = `
CREATE TABLE users (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash BINARY(60),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    status ENUM('active', 'inactive', 'banned'),
    settings JSON,
    profile_data BLOB
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

// Run all tests
console.log('Test 1 - String Functions:');
console.log(parser(test1));

console.log('\nTest 2 - Date Functions:');
console.log(parser(test2));

console.log('\nTest 3 - Conditional and Mathematical Functions:');
console.log(parser(test3));

console.log('\nTest 4 - Aggregate Functions:');
console.log(parser(test4));

console.log('\nTest 5 - Complex Joins and Subqueries:');
console.log(parser(test5));

console.log('\nTest 6 - Data Types and Table Creation:');
console.log(parser(test6));
