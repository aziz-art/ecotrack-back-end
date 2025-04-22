const mysql = require("mysql2/promise");

// Configure with your WordPress database credentials
//CREATE USER 'chaibiazi'@'%' IDENTIFIED BY 'chaibiazi2025';
//CREATE USER 'AgurbiWad'@'%' IDENTIFIED BY 'AgurbiWad2025';
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
