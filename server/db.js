const mysql = require('mysql');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306, // Correct port for MySQL
  user: 'root',
  password: 'root',
  database: 'store'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

async function createTables() {
  try {
    const SQL = `
      CREATE TABLE IF NOT EXISTS users(
        id VARCHAR(36) PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL
      )
    `;
    await query(SQL);
  } catch (error) {
    throw error;
  }
}

async function createUser(firstName, lastName, username, password) {
  const userId = uuid.v4();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const SQL = `
      INSERT INTO users (id, firstName, lastName, username, password)
      VALUES (?, ?, ?, ?, ?)
    `;
    await query(SQL, [userId, firstName, lastName, username, hashedPassword]);
    return userId;
  } catch (error) {
    throw error;
  }
}

function query(sql, args) {
  return new Promise((resolve, reject) => {
    connection.query(sql, args, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  
  createTables,
  createUser,
  
  // Include other exported functions here
};
