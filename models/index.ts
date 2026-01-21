import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import config from '../config/config';

const env = (process.env.NODE_ENV || 'development') as keyof typeof config;
const dbConfig = config[env];

const sequelize = (dbConfig as any).use_env_variable
  ? new Sequelize(process.env[(dbConfig as any).use_env_variable] || '', dbConfig as any)
  : new Sequelize(
      dbConfig.database || '',
      dbConfig.username || '',
      dbConfig.password || '',
      {
        ...dbConfig,
        port: typeof dbConfig.port === 'string' ? parseInt(dbConfig.port, 10) : dbConfig.port
      } as any
    );

const db: any = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      (file.slice(-3) === '.ts' || file.slice(-3) === '.js') &&
      file.indexOf('.test.') === -1 &&
      file.slice(-5) !== '.d.ts'
    );
  })
  .forEach((file) => {
    const filePath = path.join(__dirname, file);
    // In production, load .js files from dist, in dev load .ts files
    const modelPath = file.endsWith('.ts') && process.env.NODE_ENV === 'production' 
      ? filePath.replace('.ts', '.js')
      : filePath;
    const model = require(modelPath).default(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export individual models for easier imports
export const User = db.User;
export const Otp = db.Otp;
export const products = db.Product;
export const productVariants = db.ProductVariant;
export const carts = db.Cart;
export const cartItems = db.CartItem;
export const orders = db.Order;
export const orderItems = db.OrderItem;
export const payments = db.Payment;
export { sequelize };

export default db;

