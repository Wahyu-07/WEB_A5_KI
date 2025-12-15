const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

router.post("/create", verifyToken, requireRole([1]), roleController.createRole);
router.get("/", verifyToken, roleController.getRoles);

module.exports = router;
