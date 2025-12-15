const { Users, Roles, UserRoles, LoginAttempts, SystemLock, AccessLogs, DBChangeLogs, Orders } = require("../models/index");
const bcrypt = require("bcrypt");
const dbChangeLogController = require("./dbChangeLogController");

// --- CREATE USER & ASSIGN ROLES ---
exports.createUser = async (req, res) => {
  try {
    const { username, password, roles } = req.body;

    // Validasi manual
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password wajib diisi.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password minimal 6 karakter.",
      });
    }

    // Cek username sudah dipakai
    const exists = await Users.findOne({ where: { username } });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Username sudah digunakan.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user
    const newUser = await Users.create({
      username,
      password: hashedPassword,
    });

    // Assign roles (opsional)
    if (Array.isArray(roles) && roles.length > 0) {
      for (let r of roles) {
        await UserRoles.create({
          user_id: newUser.id,
          role_id: r,
        });
      }
    }

    await dbChangeLogController.logChange({
        table_name: "Users",
        action: "CREATE",
        record_id: newUser.id,
        user_id: req.user?.id || null, // req.user might be undefined if not authing this specific route properly, but route has middleware
        description: `Create user ${username}`
    });

    res.json({
      success: true,
      message: "User created successfully",
      data: {
        id: newUser.id,
        username: newUser.username,
        roles: roles || [],
      },
    });
  } catch (error) {
    console.error("CreateUser Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// --- GET ALL USERS + ROLES ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.findAll({
      include: [
        {
          model: Roles,
          as: "roles",
          through: { attributes: [] }, // hide junction table
        },
      ],
      order: [['id', 'ASC']]
    });

    res.json({ success: true, data: users });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};

// --- UPDATE USER ---
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, password } = req.body;

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (username) {
             const exists = await Users.findOne({ where: { username } });
             if (exists && exists.id !== parseInt(id)) {
                return res.status(409).json({ success: false, message: "Username already taken" });
             }
             user.username = username;
        }

        if (password) {
            if (password.length < 6) return res.status(400).json({ message: "Password min 6 chars" });
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        await dbChangeLogController.logChange({
            table_name: "Users",
            action: "UPDATE",
            record_id: user.id,
            user_id: req.user.id,
            description: `Update user ${user.username}`
        });

        res.json({ success: true, message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- DELETE USER ---
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Users.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Soft Delete User (Paranoid Mode)
        // No need to delete related Logs/Orders manually as the User record remains in DB (just hidden).
        // Only clean up security states (optional, but good practice)
        await LoginAttempts.destroy({ where: { user_id: id } });
        await SystemLock.destroy({ where: { user_id: id } });
        
        // Note: AccessLogs, DBChangeLogs, and Orders are PRESERVED safely.

        await user.destroy();

        await dbChangeLogController.logChange({
            table_name: "Users",
            action: "DELETE",
            record_id: id,
            user_id: req.user.id,
            description: `Delete user ${user.username}`
        });

        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
