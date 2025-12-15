module.exports = (sequelize, DataTypes) => {
  const Roles = sequelize.define("Roles", {
    name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    description: DataTypes.TEXT,
  });

  Roles.associate = (models) => {
    Roles.belongsToMany(models.Users, {
      through: models.UserRoles,
      foreignKey: "role_id",
      as: "users"
    });
  };

  return Roles;
};
