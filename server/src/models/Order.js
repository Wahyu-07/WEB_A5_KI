module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("Orders", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: { 
      type: DataTypes.DECIMAL(12,2), 
      allowNull: false, 
      defaultValue: 0 
    }
    // HAPUS baris created_at manual disini
  }, {
    timestamps: true, // Aktifkan fitur otomatis createdAt & updatedAt
    underscored: true // Ubah nama kolom di DB jadi: created_at & updated_at
  });

  Orders.associate = (models) => {
    Orders.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
    Orders.hasMany(models.OrderItems, { foreignKey: "order_id", as: "items", onDelete: 'CASCADE' });
  };

  return Orders;
};