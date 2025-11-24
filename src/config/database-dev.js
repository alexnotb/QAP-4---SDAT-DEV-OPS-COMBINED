require('dotenv').config();
const { Sequelize } = require('sequelize');

// Use SQLite for local development if PostgreSQL is not available
const isPostgresAvailable = process.env.DB_HOST && process.env.DB_HOST !== 'localhost';

const sequelize = isPostgresAvailable 
  ? new Sequelize(
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
    )
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: console.log
    });

console.log(`Using database: ${isPostgresAvailable ? 'PostgreSQL' : 'SQLite'}`);

module.exports = sequelize;
