const express = require("express");
const router = express.Router();
const controller = require("../controllers/userRoleController"); // Import semua sebagai objek 'controller'
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");

// Create (Assign Single Role) -> POST /api/user-roles
router.post("/", verifyToken, requireRole([1]), controller.create);

// Get (List All) -> GET /api/user-roles
router.get("/", verifyToken, requireRole([1]), controller.get);

// Update (Sync/Checkbox) -> PUT /api/user-roles (Biasanya update pakai PUT)
router.put("/", verifyToken, requireRole([1]), controller.update);

// 1. Hapus berdasarkan ID di URL (contoh: DELETE /api/user-roles/5)
router.delete("/:id", verifyToken, requireRole([1]), controller.delete);

// 2. Hapus berdasarkan Body JSON (contoh: DELETE /api/user-roles)
router.delete("/", verifyToken, requireRole([1]), controller.delete);

module.exports = router;