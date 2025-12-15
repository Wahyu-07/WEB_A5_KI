require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("--- TESTING DATABASE CONNECTION ---");
console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT} as user '${process.env.DB_USER}'`);
console.log(`Target Database: ${process.env.DB_NAME}`);
console.log(`Using Password: '${process.env.DB_PASS}'`);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false, 
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("✅ KONEKSI BERHASIL! Password benar.");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ KONEKSI GAGAL:", err.message);
    console.log("\nSaran: Password di file .env SALAH. Ubah DB_PASS di .env agar sesuai dengan password PostgreSQL Anda.");
    process.exit(1);
  });
