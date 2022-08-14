const mysql = require('mysql2');
const db = mysql.createPool(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'M4r4th15BAE',
        database: 'employee_db',
    },
);

db.query(`source db/schema.sql`)

module.exports = db;