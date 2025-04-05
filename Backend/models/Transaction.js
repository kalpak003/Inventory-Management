module.exports = (sequelize, DataTypes) => {
    return sequelize.define('transaction', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      productname: DataTypes.STRING,
      buyername: DataTypes.STRING,
      category: DataTypes.STRING,
      producttype: DataTypes.STRING,
      modelno: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      transdate: DataTypes.DATEONLY,
      availableqty: DataTypes.INTEGER,
      instockdate: DataTypes.DATEONLY,
      instockqty: DataTypes.INTEGER,
      dispatchdate: DataTypes.DATEONLY,
      dispatchqty: DataTypes.INTEGER,
      netstock: DataTypes.INTEGER,
      sellername: DataTypes.STRING,
      orderid: DataTypes.STRING,
      selltotalprice: DataTypes.DECIMAL(10, 2),
      transaction_type: DataTypes.STRING,
    });
  };
  