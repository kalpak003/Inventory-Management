module.exports = (sequelize, DataTypes) => {
    return sequelize.define('product', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productname: DataTypes.STRING,
      category: DataTypes.STRING,
      producttype: DataTypes.STRING,
      modelno: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.BLOB('long'),
      unit: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      status: DataTypes.ENUM('available', 'out_of_stock'),
      quantity: DataTypes.INTEGER,
    });
  };
  