module.exports = (sequelize, DataTypes) => {
    return sequelize.define('buyer', {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      company_name: DataTypes.STRING,
      concernedperson: DataTypes.STRING,
      address: DataTypes.STRING,
      contact: DataTypes.STRING,
      email: DataTypes.STRING,
      gstno: DataTypes.STRING,
    });
  };
  