module.exports = (sequelize, DataTypes) => {
  const LoginAttempts = sequelize.define("LoginAttempts", {
    user_id: DataTypes.INTEGER,
    attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    locked_until: DataTypes.DATE,
    last_attempt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    timestamps: false
  });

  LoginAttempts.associate = (models) => {
    LoginAttempts.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
  };

  return LoginAttempts;
};
