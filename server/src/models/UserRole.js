module.exports = (sequelize, DataTypes) => {
  const UserRoles = sequelize.define(
    "UserRoles",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
    },
    {
      tableName: "UserRoles",
      timestamps: false, // <<< nonaktifkan createdAt & updatedAt
    }
  );

  UserRoles.associate = (models) => {
    UserRoles.belongsTo(models.Users, { foreignKey: "user_id" });
    UserRoles.belongsTo(models.Roles, { foreignKey: "role_id" });
  };

  return UserRoles;
};
