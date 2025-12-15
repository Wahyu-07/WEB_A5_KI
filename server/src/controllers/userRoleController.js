const db = require("../models");
const UserRoles = db.UserRoles;

// CREATE: Menambah satu role (Single Assign)
exports.create = async (req, res) => {
    try {
        const { user_id, role_id } = req.body;

        const existing = await UserRoles.findOne({ where: { user_id, role_id } });
        if (existing) {
            return res.status(400).json({ message: "User already has this role" });
        }

        const data = await UserRoles.create({ user_id, role_id });
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET: Melihat semua data role user
exports.get = async (req, res) => {
    try {
        const data = await UserRoles.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Logic: Hapus semua role lama user, ganti dengan list baru
exports.update = async (req, res) => {
    try {
        const { user_id, role_ids } = req.body;
        console.log("Update User Roles Request:", { user_id, role_ids });

        if (!user_id) {
             return res.status(400).json({ message: "User ID is required" });
        }

        if (!Array.isArray(role_ids)) {
            return res.status(400).json({ message: "role_ids must be an array" });
        }

        // Deduplicate role_ids to prevent Composite Primary Key violations
        const uniqueRoleIds = [...new Set(role_ids)];

        // Hapus role lama
        // Force delete to avoid issues if PK is missing in model definition
        await UserRoles.destroy({ where: { user_id: user_id } });

        // Masukkan role baru
        if (uniqueRoleIds.length > 0) {
            const bulkData = uniqueRoleIds.map(rid => ({
                user_id: parseInt(user_id),
                role_id: parseInt(rid)
            }));
            console.log("Bulk Creating:", bulkData);
            
            // Note: validate: true ensures Sequelize checks validations before inserting
            // But if user/role IDs are valid integers, this should pass unless DB has issues.
            await UserRoles.bulkCreate(bulkData, { validate: true });
        }

        res.json({ success: true, message: "User roles updated successfully" });
    } catch (err) {
        console.error("Update Role Error Details:", JSON.stringify(err, null, 2));
        
        // Return clear error message to frontend
        const message = err.errors ? err.errors.map(e => e.message).join(", ") : err.message;
        res.status(500).json({ error: message, full_error: err });
    }
};

// DELETE: Menghapus satu role spesifik
exports.delete = async (req, res) => {
    try {
        const { user_id, role_id } = req.body; 

        // Fallback jika pakai params ID
        if (!user_id && req.params.id) {
             await UserRoles.destroy({ where: { id: req.params.id } });
             return res.json({ success: true, message: "Role removed by ID" });
        }

        const deleted = await UserRoles.destroy({
            where: { user_id, role_id }
        });

        if (deleted) {
            res.json({ success: true, message: "Role removed from user" });
        } else {
            res.status(404).json({ message: "Role not found for this user" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};