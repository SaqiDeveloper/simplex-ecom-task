/**
 * Role-Based Access Control Middleware
 * Production-level flexible middleware for role-based access control
 * Supports both boolean flags (isSuperAdmin) and role-based access
 */

const { STATUS_CODES, TEXTS } = require('../config/constants');

/**
 * Role definitions for the application
 * Maps role names to their validation functions
 */
const ROLE_VALIDATORS = {
  'super_admin': (user) => user.isSuperAdmin === true,
  'admin': (user) => user.isSuperAdmin === true || user.role === 'admin' || user.isAdmin === true,
  'user': (user) => true, // All authenticated users
  // Add more role validators as needed
};

/**
 * Flexible role-based guard middleware
 * Validates user roles and grants/denies access based on allowed roles
 * 
 * @param {string|string[]|Function} allowedRoles - Allowed role(s) or custom validator function
 * @returns {Function} Express middleware function
 * 
 * @description
 * This middleware validates user roles flexibly:
 * - Accepts single role string: requireRole('super_admin')
 * - Accepts array of roles (OR logic): requireRole(['admin', 'super_admin'])
 * - Accepts custom validator function: requireRole((user, req) => user.isSuperAdmin)
 * - Works with boolean flags (isSuperAdmin) and role strings
 * 
 * @example
 * // Single role
 * router.post('/admin/users', authenticate, requireRole('super_admin'), createUser);
 * 
 * // Multiple roles (user needs at least one)
 * router.get('/products', authenticate, requireRole(['admin', 'super_admin']), getProducts);
 * 
 * // Custom validator
 * router.delete('/user/:id', authenticate, 
 *   requireRole((user, req) => user.isSuperAdmin || user.id === req.params.id), 
 *   deleteUser
 * );
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Validate that user object exists (should be set by auth middleware)
      if (!req.user) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: TEXTS.INVALID_AUTH_TOKEN || 'Authentication required',
          error: 'User not authenticated'
        });
      }

      let hasAccess = false;
      let requiredRoles = [];

      // Handle custom validator function
      if (typeof allowedRoles === 'function') {
        try {
          hasAccess = allowedRoles(req.user, req);
        } catch (validatorError) {
          console.error('Error in custom role validator:', validatorError);
          return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'An error occurred while validating user role',
            error: process.env.NODE_ENV === 'development' ? validatorError.message : undefined
          });
        }
      } else {
        // Normalize roles to array
        const roleArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        requiredRoles = roleArray;

        // Check if user has at least one of the allowed roles (OR logic)
        hasAccess = roleArray.some(role => {
          // Check predefined role validators
          if (ROLE_VALIDATORS[role]) {
            return ROLE_VALIDATORS[role](req.user);
          }
          
          // Check if role matches user.role field (for future role-based system)
          if (req.user.role === role) {
            return true;
          }
          
          // Check boolean flags (e.g., isSuperAdmin, isAdmin)
          // Converts 'super_admin' -> 'isSuperAdmin', 'admin' -> 'isAdmin'
          const flagName = `is${role.charAt(0).toUpperCase() + role.slice(1).replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}`;
          if (req.user[flagName] === true) {
            return true;
          }
          
          return false;
        });
      }

      // If user doesn't have any of the allowed roles
      if (!hasAccess) {
        let roleMessage;
        let requiredRolesArray;
        
        if (typeof allowedRoles === 'function') {
          roleMessage = 'custom role requirement';
          requiredRolesArray = [];
        } else if (Array.isArray(requiredRoles) && requiredRoles.length > 0) {
          roleMessage = requiredRoles.join(' or ');
          requiredRolesArray = requiredRoles;
        } else {
          roleMessage = requiredRoles[0] || 'required role';
          requiredRolesArray = [allowedRoles];
        }
          
        return res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: `Access denied. Allowed roles: ${roleMessage}`,
          error: 'Insufficient privileges',
          allowedRoles: requiredRolesArray
        });
      }

      // User has at least one of the allowed roles
      return next();
    } catch (error) {
      // Handle any unexpected errors in the middleware
      console.error('Error in requireRole middleware:', error);
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred while validating user role',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};

module.exports = {
  requireRole,
  ROLE_VALIDATORS,
};
