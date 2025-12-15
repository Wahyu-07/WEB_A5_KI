module.exports = (sequelize, DataTypes) => {
  const DBChangeLog = sequelize.define("DBChangeLogs", {
    table_name: { type: DataTypes.STRING(100), allowNull: false },
    action: { type: DataTypes.STRING(20), allowNull: false },
    record_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'DBChangeLogs',
    timestamps: false
  });

  DBChangeLog.associate = (models) => {
    DBChangeLog.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
  };

  return DBChangeLog;
};
