const { LoginAttempt, SystemLock } = require("../models");
const { Op } = require("sequelize");

// Tambah percobaan login
exports.addAttempt = async (user_id) => {
  try {
    let attempt = await LoginAttempt.findOne({ where: { user_id } });

    if (!attempt) {
      attempt = await LoginAttempt.create({ user_id, attempts: 1 });
    } else {
      attempt.attempts += 1;
      attempt.last_attempt = new Date();
    }

    // Lock user setelah 5 kali gagal
    if (attempt.attempts >= 5) {
      await SystemLock.upsert({
        user_id,
        is_locked: true,
        locked_until: new Date(Date.now() + 30 * 60 * 1000), // lock 30 menit
      });
      attempt.attempts = 0; // reset counter setelah lock
    }

    await attempt.save();
  } catch (err) {
    console.error("LoginAttempt Error:", err.message);
  }
};

// Reset attempts setelah login sukses
exports.resetAttempt = async (user_id) => {
  try {
    await LoginAttempt.destroy({ where: { user_id } });
  } catch (err) {
    console.error("ResetAttempt Error:", err.message);
  }
};
