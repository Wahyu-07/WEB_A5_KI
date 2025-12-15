const { UserRoles } = require("../models");

exports.requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const userRoles = await UserRoles.findAll({
        where: { user_id: userId },
      });

      const userRoleIds = userRoles.map((r) => r.role_id);

      const hasPermission = userRoleIds.some((r) =>
        allowedRoles.includes(r)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized (akses ditolak).",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
};
