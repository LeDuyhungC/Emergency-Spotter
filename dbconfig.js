// config/dbconfig.cjs
const mysql= require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
};

let connection;

const connectToDatabase = async () => {
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the database.');
        return connection;
    } catch (err) {
        console.error('Database connection failed:', err.stack);
        throw err;
    }
};

exports = { connectToDatabase, getConnection: () => connection };