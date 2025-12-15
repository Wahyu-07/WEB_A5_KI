// src/controllers/accessLogController.js
const { AccessLogs } = require("../models");

// Digunakan di auth controller
exports.createLog = async ({ user_id, action, req }) => {
  try {
    await AccessLogs.create({
      user_id,
      action,
      ip_address: req?.ip || req?.headers['x-forwarded-for'] || 'unknown',
      user_agent: req?.headers['user-agent'] || 'unknown'
    });
    console.log(`AccessLog: ${action} user_id=${user_id}`);
  } catch (err) {
    console.error("AccessLog Error:", err.message);
  }
};

// Digunakan untuk route GET /access-logs (admin)
exports.getLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const { Sequelize } = require("../models");
    const Op = Sequelize.Op;

    let whereClause = {};

    if (startDate && endDate) {
        // Set start time to 00:00:00
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        // Set end time to 23:59:59
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        whereClause.createdAt = {
            [Op.between]: [start, end]
        };
    } else if (startDate) {
         const start = new Date(startDate);
         start.setHours(0, 0, 0, 0);
         whereClause.createdAt = { [Op.gte]: start };
    }

    const logs = await AccessLogs.findAll({
      where: whereClause,
      include: ["user"],
      order: [["createdAt", "DESC"]],
      limit: 100 // Increased limit to see more logs when filtering
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
