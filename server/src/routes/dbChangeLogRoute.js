const express = require("express");
const router = express.Router();
const controller = require("../controllers/dbChangeLogController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

router.get("/", verifyToken, requireRole([1]), controller.getLogs);

module.exports = router;
