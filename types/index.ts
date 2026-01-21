import { Request, Response, NextFunction } from 'express';
import { Model } from 'sequelize';

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  password: string;
  isSuperAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export interface ProductAttributes {
  id: string;
  name: string;
  desc?: string | null;
  isVariable: boolean;
  isActive: boolean;
  price: number;
  purchasePrice: number;
  profitMargin: number;
  stock?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductInstance extends Model<ProductAttributes>, ProductAttributes {}

export interface ProductVariantAttributes {
  id: string;
  productId: string;
  variantsName: string;
  value: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductVariantInstance extends Model<ProductVariantAttributes>, ProductVariantAttributes {}

export interface CartAttributes {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartInstance extends Model<CartAttributes>, CartAttributes {}

export interface CartItemAttributes {
  id: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItemInstance extends Model<CartItemAttributes>, CartItemAttributes {}

export interface OrderAttributes {
  id: string;
  userId: string;
  cartId: string;
  orderNumber: string;
  totalAmount: number;
  shippingAddress?: string | null;
  status: string;
  paymentStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderInstance extends Model<OrderAttributes>, OrderAttributes {}

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemInstance extends Model<OrderItemAttributes>, OrderItemAttributes {}

export interface PaymentAttributes {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentInstance extends Model<PaymentAttributes>, PaymentAttributes {}

export interface OtpAttributes {
  id: string;
  userId?: string | null;
  email?: string | null;
  phone?: string | null;
  otpHash: string;
  type: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OtpInstance extends Model<OtpAttributes>, OtpAttributes {}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    isSuperAdmin: boolean;
  };
  pagination?: {
    page: number;
    limit: number;
    offset: number;
  };
}

export type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
export type AuthenticatedMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Promise<void>;

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  isSuperAdmin: boolean;
}

export interface TokenResult {
  err: Error | null;
  decoded?: JwtPayload;
}

