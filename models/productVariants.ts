import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProductVariantAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class productVariants extends Model<ProductVariantAttributes, ProductVariantAttributes> implements ProductVariantAttributes {
    declare id: string;
    declare productId: string;
    declare variantsName: string;
    declare value: string;
    declare price: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
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
  }, {
    sequelize,
    modelName: 'productVariants',
    timestamps: true,
    underscored: false,
  });

  return productVariants;
};

