const { SystemLock } = require("../models");

exports.checkUserLock = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const lock = await SystemLock.findOne({ where: { user_id: userId } });

    if (lock && lock.is_locked) {
      const now = new Date();
      if (lock.locked_until && new Date(lock.locked_until) > now) {
        return res.status(403).json({
          success: false,
          message: `User terkunci hingga ${lock.locked_until}`,
        });
      } else {
        // Unlock otomatis jika waktu habis
        lock.is_locked = false;
        lock.locked_until = null;
        await lock.save();
      }
    }

    next();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
