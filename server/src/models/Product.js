module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define("Products", {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(12,2), allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  });

  Products.associate = (models) => {
    Products.hasMany(models.OrderItems, { foreignKey: "product_id", as: "orderItems" });
  };

  return Products;
};
