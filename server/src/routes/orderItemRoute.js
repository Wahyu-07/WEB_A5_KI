const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderItemController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

// POST: Menambah Item ke Order
// HANYA KASIR (Role ID 2)
router.post("/", verifyToken, requireRole([2]), controller.addItem);

// GET: Melihat detail Item
// Admin (1), Kasir (2), dan Owner (3) boleh melihat
router.get("/", verifyToken, requireRole([1, 2, 3]), controller.getItems);

module.exports = router;