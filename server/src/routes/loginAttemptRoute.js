const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { requireRole } = require("../middleware/roleCheck");
const { SystemLock, Users } = require("../models");

// GET semua user lock (Admin only)
router.get("/", verifyToken, requireRole([1]), async (req, res) => {
  const locks = await SystemLock.findAll({
    include: [{
      model: Users,
      as: 'user',
      attributes: ['username']
    }]
  });
  res.json({ success: true, data: locks });
});

// Unlock user manual (Admin only)
router.put("/unlock/:user_id", verifyToken, requireRole([1]), async (req, res) => {
  const user_id = req.params.user_id;
  const lock = await SystemLock.findOne({ where: { user_id } });
  if (!lock) return res.status(404).json({ message: "User lock tidak ditemukan" });
  lock.is_locked = false;
  lock.locked_until = null;
  await lock.save();
  res.json({ success: true, message: "User unlocked" });
});

module.exports = router;
