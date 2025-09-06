const mysql = require("mysql2/promise");

const adminUser = {
	user: process.env.SOLVE_DB_USER_ADMIN,
	password: process.env.SOLVE_DB_PASSWORD_ADMIN,
};
const readonlyUser = {
	user: process.env.SOLVE_DB_USER_READONLY,
	password: process.env.SOLVE_DB_PASSWORD_READONLY,
};

const solvePool = mysql.createPool({
	host: process.env.SOLVE_DB_HOST,
	user: process.env.SOLVE_DB_USER_ADMIN,
	password: process.env.SOLVE_DB_PASSWORD_ADMIN,
	waitForConnections: true,
	connectionLimit: 200,
	multipleStatements: true,
	queueLimit: 0,
});

module.exports = {
	adminUser,
	readonlyUser,
	solvePool,
};
