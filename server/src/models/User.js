module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
  }, {
    timestamps: true,
    paranoid: true, // Enable Soft Deletion
  });

  Users.associate = (models) => {
    Users.belongsToMany(models.Roles, {
      through: models.UserRoles,
      foreignKey: "user_id",
      as: "roles"
    });
    Users.hasMany(models.LoginAttempts, { foreignKey: "user_id", as: "loginAttempts" });
    Users.hasMany(models.AccessLogs, { foreignKey: "user_id", as: "accessLogs" });
    Users.hasMany(models.DBChangeLogs, { foreignKey: "user_id", as: "dbChangeLogs" });
    Users.hasMany(models.Orders, { foreignKey: "user_id", as: "orders" });
    Users.hasMany(models.SystemLock, { foreignKey: "user_id", as: "locks" });
  };

  return Users;
};
