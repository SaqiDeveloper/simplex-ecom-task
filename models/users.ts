import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
    declare id: string;
    declare name: string;
    declare email: string;
    declare phone: string | null;
    declare password: string;
    declare isSuperAdmin: boolean;
    declare createdAt?: Date;
    declare updatedAt?: Date;
    declare deletedAt?: Date | null;

    static associate(models: any) {
      User.hasMany(models.carts, {
        foreignKey: 'userId',
        as: 'Carts'
      });
      User.hasMany(models.orders, {
        foreignKey: 'userId',
        as: 'Orders'
      });
      User.hasMany(models.payments, {
        foreignKey: 'userId',
        as: 'Payments'
      });
    }
  }

  User.init({
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    isSuperAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  });

  return User;
};

