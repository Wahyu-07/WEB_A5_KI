// src/routes/accessLogRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/accessLogController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

router.get("/", verifyToken, requireRole([1]), controller.getLogs); // Admin only

module.exports = router;
