const { Sequelize } = require("sequelize");

console.log("DB Config Check:", {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    db: process.env.DB_NAME,
    passLength: process.env.DB_PASS ? process.env.DB_PASS.length : 0
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
    logging: false,
  }
);

module.exports = sequelize;
