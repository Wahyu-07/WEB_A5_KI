// src/routes/systemLockRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/systemLockController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

// Lock user
router.post("/lock", verifyToken, requireRole([1]), controller.lockSystem);

// Unlock user
router.put("/unlock/:id", verifyToken, requireRole([1]), controller.unlockSystem);

module.exports = router;
