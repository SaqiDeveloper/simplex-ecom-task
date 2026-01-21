import { Model, DataTypes, Sequelize } from 'sequelize';
import { CartItemAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class cartItems extends Model<CartItemAttributes, CartItemAttributes> implements CartItemAttributes {
    declare id: string;
    declare cartId: string;
    declare productId: string;
    declare variantId: string | null;
    declare quantity: number;
    declare price: number;
    declare subtotal: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
      cartItems.belongsTo(models.carts, {
        foreignKey: 'cartId',
        as: 'Cart'
      });
      cartItems.belongsTo(models.products, {
        foreignKey: 'productId',
        as: 'Product'
      });
      cartItems.belongsTo(models.productVariants, {
        foreignKey: 'variantId',
        as: 'Variant'
      });
    }
  }

  cartItems.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    variantId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  }, {
    sequelize,
    modelName: 'cartItems',
    timestamps: true,
    underscored: false,
  });

  return cartItems;
};

