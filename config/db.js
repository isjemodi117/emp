import mysql from 'mysql2/promise';
export const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER ||  'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'medical_portal',
    port: number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
    connectionLimit: 10,
});
