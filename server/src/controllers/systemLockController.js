const db = require("../models");
const SystemLock = db.SystemLock;

exports.lockSystem = async (req, res) => {
    try {
        const { user_id, locked_until } = req.body;
        const data = await SystemLock.create({
            user_id,
            is_locked: true,
            locked_until
        });

        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unlockSystem = async (req, res) => {
    try {
        await SystemLock.update(
            { is_locked: false, locked_until: null },
            { where: { id: req.params.id } }
        );

        res.json({ success: true, message: "System unlocked" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
