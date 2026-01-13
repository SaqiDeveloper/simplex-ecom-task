'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      products.hasMany(models.productVariants, {
        foreignKey: 'productId',
        as: 'Variants'
      });
      products.hasMany(models.cartItems, {
        foreignKey: 'productId',
        as: 'CartItems'
      });
      products.hasMany(models.orderItems, {
        foreignKey: 'productId',
        as: 'OrderItems'
      });
    }
  }
  products.init({

    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0.00
    },
  },

    {
      sequelize,
      modelName: 'products',
      timestamps: true,
      underscored: false,
    });
  return products;
};