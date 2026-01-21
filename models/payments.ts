import { Model, DataTypes, Sequelize } from 'sequelize';
import { PaymentAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class payments extends Model<PaymentAttributes, PaymentAttributes> implements PaymentAttributes {
    declare id: string;
    declare orderId: string;
    declare userId: string;
    declare amount: number;
    declare paymentMethod: string;
    declare status: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
      payments.belongsTo(models.orders, {
        foreignKey: 'orderId',
        as: 'Order'
      });
      payments.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
      });
    }
  }

  payments.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM('cash', 'card', 'online', 'wallet'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'payments',
    timestamps: true,
    underscored: false,
  });

  return payments;
};

