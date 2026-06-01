// backend/config/db.js
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || process.env.HOST || "localhost",
  user: process.env.DB_USER || process.env.USER,
  password: process.env.DB_PASSWORD || process.env.PASSWORD,
  database: process.env.DB_NAME || process.env.DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
  } else {
    console.log(" MySQL connected successfully!");
  }
});

module.exports = connection;
