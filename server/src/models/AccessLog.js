module.exports = (sequelize, DataTypes) => {
  const AccessLog = sequelize.define(
    "AccessLogs",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      action: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      ip_address: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      }
    },
    {
      tableName: "AccessLogs",
      timestamps: false // karena kamu manual pakai createdAt
    }
  );

  AccessLog.associate = (models) => {
    AccessLog.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
  };

  return AccessLog;
};
