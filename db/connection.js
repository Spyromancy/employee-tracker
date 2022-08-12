const mysql = require('mysql2/promise');
const bluebird = require('bluebird')

const db = await mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'M4r4th15BAE',
        database: 'employee_db',
        Promise: bluebird
    },
);

module.exports = db;