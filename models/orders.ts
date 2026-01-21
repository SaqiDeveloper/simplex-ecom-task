import { Model, DataTypes, Sequelize } from 'sequelize';
import { OrderAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class orders extends Model<OrderAttributes, OrderAttributes> implements OrderAttributes {
    declare id: string;
    declare userId: string;
    declare cartId: string;
    declare orderNumber: string;
    declare totalAmount: number;
    declare shippingAddress: string | null;
    declare status: string;
    declare paymentStatus: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
      orders.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
      });
      orders.belongsTo(models.carts, {
        foreignKey: 'cartId',
        as: 'Cart'
      });
      orders.hasMany(models.orderItems, {
        foreignKey: 'orderId',
        as: 'OrderItems'
      });
      orders.hasMany(models.payments, {
        foreignKey: 'orderId',
        as: 'Payments'
      });
    }
  }

  orders.init({
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
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'orders',
    timestamps: true,
    underscored: false,
  });

  return orders;
};

