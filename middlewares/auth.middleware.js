/**
 * Authentication Middleware
 * Production-level middleware for JWT token validation
 * Verifies and decodes JWT tokens from Authorization header
 */

const { verifyJWTToken } = require("../utils/jwtToken");
const { STATUS_CODES, TEXTS } = require("../config/constants");
const { User } = require("../models");

/**
 * Middleware to authenticate requests using JWT tokens
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Returns next() on success or error response on failure
 * 
 * @description
 * Extracts JWT token from Authorization header (Bearer token format)
 * Verifies token and attaches decoded user data to req.user
 * 
 * @example
 * router.get('/profile', authenticate, getProfile);
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract Authorization header
    const header = req.get("Authorization");
    
    // Validate Authorization header format
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.INVALID_AUTH_TOKEN || "Invalid or missing authorization token",
        error: "Authorization header must be in format: Bearer <token>"
      });
    }

    // Extract token from header (format: "Bearer <token>")
    const accessToken = header.split(" ")[1];
    
    // Validate token exists
    if (!accessToken) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.NO_AUTH_GIVEN || "No authentication token provided",
        error: "Token is missing from Authorization header"
      });
    }

    // Verify and decode JWT token
    const result = await verifyJWTToken(accessToken);
    
    // Check if token verification failed
    if (result.err) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.INVALID_AUTH_TOKEN || "Invalid or expired token",
        error: result.err.message || "Token verification failed"
      });
    }

    // Validate decoded token contains user data
    if (!result.decoded) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: TEXTS.INVALID_AUTH_TOKEN || "Invalid token payload",
        error: "Token does not contain valid user data"
      });
    }

    // Attach decoded user data to request object
    req.user = result.decoded;
    
    // Proceed to next middleware/route handler
    return next();
  } catch (error) {
    // Handle any unexpected errors in the middleware
    console.error('Error in authenticate middleware:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred during authentication",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  authenticate,
};
