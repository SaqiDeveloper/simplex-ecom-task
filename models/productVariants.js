'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productVariants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      productVariants.belongsTo(models.products, {
        foreignKey: 'productId',
        as: 'Product'
      });
      productVariants.hasMany(models.cartItems, {
        foreignKey: 'variantId',
        as: 'CartItems'
      });
      productVariants.hasMany(models.orderItems, {
        foreignKey: 'variantId',
        as: 'OrderItems'
      });
    }
  }
  productVariants.init({

    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    variantsName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.literal("'SKU-' || LPAD(nextval('product_variant_sku_seq')::text, 6, '0')"),
    },
  }, {
    sequelize,
    modelName: 'productVariants',
    timestamps: true,
    underscored: false,
  });
  return productVariants;
};