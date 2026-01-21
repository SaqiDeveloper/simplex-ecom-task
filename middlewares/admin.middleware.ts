import { Response, NextFunction } from 'express';
import { STATUS_CODES, TEXTS } from '../config/constants';
import { AuthenticatedRequest } from '../types';

type RoleValidator = (user: NonNullable<AuthenticatedRequest['user']>) => boolean;
type CustomRoleValidator = (user: NonNullable<AuthenticatedRequest['user']>, req: AuthenticatedRequest) => boolean;

const ROLE_VALIDATORS: Record<string, RoleValidator> = {
  'super_admin': (user) => user.isSuperAdmin === true,
  'admin': (user) => user.isSuperAdmin === true || (user as any).role === 'admin' || (user as any).isAdmin === true,
  'user': () => true,
};

export const requireRole = (
  allowedRoles: string | string[] | CustomRoleValidator
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: TEXTS.INVALID_AUTH_TOKEN || 'Authentication required',
          error: 'User not authenticated'
        });
        return;
      }

      let hasAccess = false;
      let requiredRoles: string[] = [];

      if (typeof allowedRoles === 'function') {
        try {
          hasAccess = allowedRoles(req.user, req);
        } catch (validatorError) {
          console.error('Error in custom role validator:', validatorError);
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'An error occurred while validating user role',
            error: process.env.NODE_ENV === 'development' ? (validatorError as Error).message : undefined
          });
          return;
        }
      } else {
        const roleArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        requiredRoles = roleArray;

        hasAccess = roleArray.some(role => {
          if (ROLE_VALIDATORS[role]) {
            return ROLE_VALIDATORS[role](req.user!);
          }
          
          if ((req.user as any).role === role) {
            return true;
          }
          
          const flagName = `is${role.charAt(0).toUpperCase() + role.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}`;
          if ((req.user as any)[flagName] === true) {
            return true;
          }
          
          return false;
        });
      }

      if (!hasAccess) {
        let roleMessage: string;
        let requiredRolesArray: string[];
        
        if (typeof allowedRoles === 'function') {
          roleMessage = 'custom role requirement';
          requiredRolesArray = [];
        } else if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
          roleMessage = requiredRoles.join(' or ');
          requiredRolesArray = requiredRoles;
        } else {
          roleMessage = requiredRoles[0] || 'required role';
          requiredRolesArray = [allowedRoles as string];
        }
          
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: `Access denied. Allowed roles: ${roleMessage}`,
          error: 'Insufficient privileges',
          allowedRoles: requiredRolesArray
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error in requireRole middleware:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred while validating user role',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };
};

export { ROLE_VALIDATORS };

