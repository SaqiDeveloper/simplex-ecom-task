import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProductAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class products extends Model<ProductAttributes, ProductAttributes> implements ProductAttributes {
    declare id: string;
    declare name: string;
    declare desc: string | null;
    declare isVariable: boolean;
    declare isActive: boolean;
    declare price: number;
    declare purchasePrice: number;
    declare profitMargin: number;
    declare stock: number | null;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    isVariable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    purchasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    profitMargin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'products',
    timestamps: true,
    underscored: false,
  });

  return products;
};

