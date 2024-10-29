const Sequelize = require('sequelize');
require('dotenv').config();

console.log('Database Config:', process.env.DATABASE_URL);  // Log DATABASE_URL to confirm it’s set

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,  // Necessary for Render's managed PostgreSQL
      },
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'postgres',
      port: process.env.DB_PORT || 5432,
    }
  );
}

module.exports = sequelize;
