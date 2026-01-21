import { Model, DataTypes, Sequelize } from 'sequelize';
import { CartAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class carts extends Model<CartAttributes, CartAttributes> implements CartAttributes {
    declare id: string;
    declare userId: string;
    declare status: string;
    declare totalAmount: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
      carts.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
      });
      carts.hasMany(models.cartItems, {
        foreignKey: 'cartId',
        as: 'CartItems'
      });
      carts.hasMany(models.orders, {
        foreignKey: 'cartId',
        as: 'Orders'
      });
    }
  }

  carts.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'abandoned'),
      allowNull: false,
      defaultValue: 'active',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  }, {
    sequelize,
    modelName: 'carts',
    timestamps: true,
    underscored: false,
  });

  return carts;
};

