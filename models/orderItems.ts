import { Model, DataTypes, Sequelize } from 'sequelize';
import { OrderItemAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class orderItems extends Model<OrderItemAttributes, OrderItemAttributes> implements OrderItemAttributes {
    declare id: string;
    declare orderId: string;
    declare productId: string;
    declare variantId: string | null;
    declare quantity: number;
    declare price: number;
    declare subtotal: number;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
      orderItems.belongsTo(models.orders, {
        foreignKey: 'orderId',
        as: 'Order'
      });
      orderItems.belongsTo(models.products, {
        foreignKey: 'productId',
        as: 'Product'
      });
      orderItems.belongsTo(models.productVariants, {
        foreignKey: 'variantId',
        as: 'Variant'
      });
    }
  }

  orderItems.init({
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
    modelName: 'orderItems',
    timestamps: true,
    underscored: false,
  });

  return orderItems;
};

