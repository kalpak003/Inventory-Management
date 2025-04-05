module.exports = (sequelize, DataTypes) => {
    return sequelize.define('seller', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      companyname: DataTypes.STRING,
      concernedperson: DataTypes.STRING,
      address: DataTypes.STRING,
      contact: DataTypes.STRING,
      email: DataTypes.STRING,
      gstno: DataTypes.STRING,
    });
  };
  