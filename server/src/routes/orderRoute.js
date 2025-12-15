const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

// POST: Membuat Order/Faktur Baru
// HANYA KASIR (Role ID 2)
router.post("/", verifyToken, requireRole([2]), controller.createOrder);

// GET: Melihat Data Order
// Admin (1), Kasir (2), dan Owner (3) boleh melihat
router.get("/", verifyToken, requireRole([1, 2, 3]), controller.getOrders);

module.exports = router;