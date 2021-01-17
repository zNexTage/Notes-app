require('dotenv/config')

const mysql = require('mysql'); 

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

module.exports = connection;