'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Urls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Urls.init(
    {
      long_url: DataTypes.STRING,
      short_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Urls',
      tableName: 'urls',
    }
  );
  return Urls;
};
