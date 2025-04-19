const mysql = require('mysql2/promise');

// Configure with your WordPress database credentials
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecotrack_wordpress',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
