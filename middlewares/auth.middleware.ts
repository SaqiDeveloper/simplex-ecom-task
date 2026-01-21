import { Response, NextFunction } from 'express';
import { verifyJWTToken } from '../utils/jwtToken';
import { STATUS_CODES, TEXTS } from '../config/constants';
import { AuthenticatedRequest } from '../types';

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const header = req.get("Authorization");
    
    if (!header || !header.startsWith("Bearer ")) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.INVALID_AUTH_TOKEN || "Invalid or missing authorization token",
        error: "Authorization header must be in format: Bearer <token>"
      });
      return;
    }

    const accessToken = header.split(" ")[1];
    
    if (!accessToken) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.NO_AUTH_GIVEN || "No authentication token provided",
        error: "Token is missing from Authorization header"
      });
      return;
    }

    const result = await verifyJWTToken(accessToken);
    
    if (result.err) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.INVALID_AUTH_TOKEN || "Invalid or expired token",
        error: result.err.message || "Token verification failed"
      });
      return;
    }

    if (!result.decoded) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.INVALID_AUTH_TOKEN || "Invalid token payload",
        error: "Token does not contain valid user data"
      });
      return;
    }

    req.user = result.decoded;
    
    next();
  } catch (error) {
    console.error('Error in authenticate middleware:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred during authentication",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

