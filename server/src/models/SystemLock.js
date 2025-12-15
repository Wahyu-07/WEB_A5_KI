module.exports = (sequelize, DataTypes) => {
  const SystemLock = sequelize.define("SystemLock", {
    user_id: DataTypes.INTEGER,
    is_locked: { type: DataTypes.BOOLEAN, defaultValue: false },
    locked_until: DataTypes.DATE
  }, {
    tableName: 'SystemLock', // Explisit nama tabel agar aman
    timestamps: false
  });

  SystemLock.associate = (models) => {
    SystemLock.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
  };

  return SystemLock;
};
