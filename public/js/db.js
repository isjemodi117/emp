const db = require("./config/db");
// config/db.js
require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  port: process.env.PORT || 3306,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12022003Main.",
  database: process.env.DB_NAME || "meds"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("MySQL Connected");
});

module.exports = db;
