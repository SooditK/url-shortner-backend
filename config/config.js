const fs = require('fs');
require('dotenv').config();
// const config = require('./config.json')[process.env.NODE_ENV || 'development'];

// console.log(process.env);

module.exports = {
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      ca: fs
        .readFileSync(process.env.HOME + process.env.DATABASE_SSL_CA)
        .toString(),
    },
  },
};
