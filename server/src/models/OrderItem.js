module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define("OrderItems", {
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(12,2), allowNull: false }
  }, {
    timestamps: true, 
    underscored: true // Konsisten pakai snake_case
  });

  OrderItems.associate = (models) => {
    OrderItems.belongsTo(models.Orders, { foreignKey: "order_id", as: "order" });
    OrderItems.belongsTo(models.Products, { foreignKey: "product_id", as: "product" });
  };

  return OrderItems;
};