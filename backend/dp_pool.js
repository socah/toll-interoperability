require('dotenv').config()

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

module.exports = pool