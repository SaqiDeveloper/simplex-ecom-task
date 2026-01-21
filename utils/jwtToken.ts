import jwt from 'jsonwebtoken';
import { JwtPayload, TokenResult } from '../types';

export const generateToken = (userData: JwtPayload): string => {
  const payload = { ...userData };
  const secret = process.env.JWT_SECRETE_KEY || '';
  return jwt.sign(payload, secret, { expiresIn: "10h" });
};

export const verifyJWTToken = async (token: string): Promise<TokenResult> => {
  const secret = process.env.JWT_SECRETE_KEY || '';
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, decoded) => {
      resolve({
        err: err as Error | null,
        decoded: decoded as JwtPayload | undefined
      });
    });
  });
};

