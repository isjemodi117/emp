import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_password || '',
  database: process.env.DB_NAME || 'medical_portal',
  port: Numer(process.env.DB_PORT || 3306,
  multipleStatements: true,
  connectionLimit: 10,
              });
                                   
