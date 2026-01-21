import { Model, DataTypes, Sequelize } from 'sequelize';
import { OtpAttributes } from '../types';

export default (sequelize: Sequelize) => {
  class Otp extends Model<OtpAttributes, OtpAttributes> implements OtpAttributes {
    declare id: string;
    declare userId: string | null;
    declare email: string | null;
    declare phone: string | null;
    declare otpHash: string;
    declare type: string;
    declare expiresAt: Date;
    declare isUsed: boolean;
    declare createdAt?: Date;
    declare updatedAt?: Date;

    static associate(models: any) {
      Otp.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Otp.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('email', 'phone'),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Otp',
    tableName: 'otps',
    timestamps: true,
  });

  return Otp;
};

