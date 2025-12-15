require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Import database (models)
const db = require("./src/models");

// Import routes
const authRoutes = require("./src/routes/authRoute");
const userRoutes = require("./src/routes/userRoute");
const roleRoutes = require("./src/routes/roleRoute");
const userRoleRoutes = require("./src/routes/userRoleRoute"); // <--- BARU DITAMBAHKAN
const productRoutes = require("./src/routes/productRoute");
const orderRoutes = require("./src/routes/orderRoute");
const orderItemRoutes = require("./src/routes/orderItemRoute");
const loginAttemptRoutes = require("./src/routes/loginAttemptRoute");
const accessLogRoutes = require("./src/routes/accessLogRoute");
const dbChangeLogRoutes = require("./src/routes/dbChangeLogRoute");
const systemLockRoutes = require("./src/routes/systemLockRoute");

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.json({ message: "API berjalan..." });
});

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/user-roles", userRoleRoutes); // <--- BARU DITAMBAHKAN (Endpoint: /api/user-roles)
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/login-attempts", loginAttemptRoutes);
app.use("/api/access-logs", accessLogRoutes);
app.use("/api/db-change-logs", dbChangeLogRoutes);
app.use("/api/system-lock", systemLockRoutes);

// Sync database
// Sync database
// Force sync SystemLock to ensure DataType is correct (TIMESTAMP)
db.SystemLock.sync({ force: true })
  .then(() => db.sequelize.sync({ alter: true }))
  .then(() => console.log("Database connected & synchronized (SystemLock recreated)"))
  .catch((err) => console.error("DB Sync Error:", err));

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});