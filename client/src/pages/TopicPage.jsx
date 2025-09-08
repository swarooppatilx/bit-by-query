import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Play, CheckCircle } from 'lucide-react';

// Data Store
const topics = [
  {
    id: 1,
    title: 'Basic SELECT Queries',
    description: 'Learn fundamental SELECT operations',
    difficulty: 'Easy',
    questions: 4
  },
  {
    id: 2,
    title: 'JOIN Operations',
    description: 'Master INNER, LEFT, RIGHT, and FULL JOINs',
    difficulty: 'Medium',
    questions: 4
  },
  {
    id: 3,
    title: 'Aggregate Functions',
    description: 'GROUP BY, HAVING, COUNT, SUM, AVG',
    difficulty: 'Medium',
    questions: 3
  },
  {
    id: 4,
    title: 'Window Functions',
    description: 'Advanced ranking and analytical functions',
    difficulty: 'Hard',
    questions: 3
  },
  {
    id: 5,
    title: 'Subqueries & CTEs',
    description: 'Complex nested queries and Common Table Expressions',
    difficulty: 'Hard',
    questions: 4
  },
  {
    id: 6,
    title: 'String Functions',
    description: 'Text manipulation and pattern matching',
    difficulty: 'Easy',
    questions: 3
  }
];

const questionsData = {
  1: [ // Basic SELECT Queries
    {
      id: 1,
      title: 'Select All Employees',
      difficulty: 'Easy',
      description: 'Write a query to select all columns from the employees table.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(30),
  salary INT,
  hire_date DATE
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', 'Engineering', 75000, '2022-01-15'),
(2, 'Jane Smith', 'Marketing', 65000, '2022-03-20'),
(3, 'Mike Johnson', 'Sales', 55000, '2021-11-10');`,
      expectedOutput: 'All employee records with all columns',
      solution: 'SELECT * FROM employees;'
    },
    {
      id: 2,
      title: 'Filter by Salary',
      difficulty: 'Easy',
      description: 'Find all employees with salary greater than 60000.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(30),
  salary INT,
  hire_date DATE
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', 'Engineering', 75000, '2022-01-15'),
(2, 'Jane Smith', 'Marketing', 65000, '2022-03-20'),
(3, 'Mike Johnson', 'Sales', 55000, '2021-11-10');`,
      expectedOutput: 'Employees with salary > 60000',
      solution: 'SELECT * FROM employees WHERE salary > 60000;'
    },
    {
      id: 3,
      title: 'Order by Name',
      difficulty: 'Easy',
      description: 'Select employee names and departments, ordered by name alphabetically.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(30),
  salary INT,
  hire_date DATE
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', 'Engineering', 75000, '2022-01-15'),
(2, 'Jane Smith', 'Marketing', 65000, '2022-03-20'),
(3, 'Mike Johnson', 'Sales', 55000, '2021-11-10');`,
      expectedOutput: 'Names and departments ordered alphabetically',
      solution: 'SELECT name, department FROM employees ORDER BY name;'
    },
    {
      id: 4,
      title: 'Distinct Departments',
      difficulty: 'Easy',
      description: 'Find all unique departments in the company.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(30),
  salary INT,
  hire_date DATE
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', 'Engineering', 75000, '2022-01-15'),
(2, 'Jane Smith', 'Marketing', 65000, '2022-03-20'),
(3, 'Mike Johnson', 'Sales', 55000, '2021-11-10'),
(4, 'Sarah Wilson', 'Engineering', 80000, '2022-05-01');`,
      expectedOutput: 'Unique department names',
      solution: 'SELECT DISTINCT department FROM employees;'
    }
  ],
  2: [ // JOIN Operations
    {
      id: 1,
      title: 'Employee Department Join',
      difficulty: 'Medium',
      description: 'Join employees with their department details.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  dept_id INT,
  salary INT
);

CREATE TABLE departments (
  id INT PRIMARY KEY,
  dept_name VARCHAR(50),
  location VARCHAR(50)
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', 1, 75000),
(2, 'Jane Smith', 2, 65000);

INSERT INTO departments VALUES 
(1, 'Engineering', 'New York'),
(2, 'Marketing', 'Los Angeles');`,
      expectedOutput: 'Employee names with department names and locations',
      solution: 'SELECT e.name, d.dept_name, d.location FROM employees e INNER JOIN departments d ON e.dept_id = d.id;'
    },
    {
      id: 2,
      title: 'Left Join Example',
      difficulty: 'Medium',
      description: 'Show all employees including those without department assignments.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  dept_id INT,
  salary INT
);

CREATE TABLE departments (
  id INT PRIMARY KEY,
  dept_name VARCHAR(50),
  location VARCHAR(50)
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', 1, 75000),
(2, 'Jane Smith', 2, 65000),
(3, 'Bob Wilson', NULL, 70000);

INSERT INTO departments VALUES 
(1, 'Engineering', 'New York'),
(2, 'Marketing', 'Los Angeles');`,
      expectedOutput: 'All employees with their department info (NULL if no department)',
      solution: 'SELECT e.name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id;'
    },
    {
      id: 3,
      title: 'Multiple Table Join',
      difficulty: 'Medium',
      description: 'Join employees, departments, and projects tables.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  dept_id INT
);

CREATE TABLE departments (
  id INT PRIMARY KEY,
  dept_name VARCHAR(50)
);

CREATE TABLE projects (
  id INT PRIMARY KEY,
  project_name VARCHAR(50),
  emp_id INT
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', 1),
(2, 'Jane Smith', 2);

INSERT INTO departments VALUES 
(1, 'Engineering'),
(2, 'Marketing');

INSERT INTO projects VALUES 
(1, 'Website Redesign', 1),
(2, 'Mobile App', 1);`,
      expectedOutput: 'Employee names, departments, and their projects',
      solution: 'SELECT e.name, d.dept_name, p.project_name FROM employees e JOIN departments d ON e.dept_id = d.id JOIN projects p ON e.id = p.emp_id;'
    },
    {
      id: 4,
      title: 'Self Join',
      difficulty: 'Medium',
      description: 'Find employees and their managers using self join.',
      schema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  manager_id INT
);`,
      sampleData: `INSERT INTO employees VALUES 
(1, 'John Doe', NULL),
(2, 'Jane Smith', 1),
(3, 'Mike Johnson', 1),
(4, 'Sarah Wilson', 2);`,
      expectedOutput: 'Employee names with their manager names',
      solution: 'SELECT e.name as employee, m.name as manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;'
    }
  ]
};

// Utility Components
const DifficultyBadge = ({ difficulty }) => (
  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
    difficulty === 'Easy' ? 'bg-green-600 text-green-100' :
    difficulty === 'Medium' ? 'bg-yellow-600 text-yellow-100' :
    'bg-red-600 text-red-100'
  }`}>
    {difficulty}
  </div>
);

const BackButton = ({ onClick, text = "Back" }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
  >
    <ArrowLeft size={20} />
    <span>{text}</span>
  </button>
);

//main page
const TopicPage = ({ onBackToHome, onSelectTopic }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <BackButton onClick={onBackToHome} text="Back to Home" />
          <h1 className="text-3xl font-bold text-blue-400">SQL Practice Topics</h1>
          <div></div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <DifficultyBadge difficulty={topic.difficulty} />
                <ChevronRight className="text-gray-400" size={20} />
              </div>
              
              <h3 className="text-xl font-bold text-blue-300 mb-2">{topic.title}</h3>
              <p className="text-gray-300 mb-4">{topic.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{topic.questions} Questions</span>
                <button 
                  onClick={() => onSelectTopic(topic)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export { questionsData };
export default TopicPage;