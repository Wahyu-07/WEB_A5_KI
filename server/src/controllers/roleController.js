const { Roles } = require("../models/index");

exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newRole = await Roles.create({ name, description });

    res.json({ success: true, data: newRole });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll();
    res.json({ success: true, data: roles });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
};
