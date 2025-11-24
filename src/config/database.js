require('dotenv').config();
const { Sequelize } = require('sequelize');

// Check if we should use SQLite for local development
const useSQLite = process.env.USE_SQLITE === 'true' || !process.env.DB_HOST;

const sequelize = useSQLite
  ? new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    );

console.log(`Using database: ${useSQLite ? 'SQLite (Local)' : 'PostgreSQL'}`);

module.exports = sequelize;
