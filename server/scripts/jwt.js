require('dotenv').config();

module.exports.JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
