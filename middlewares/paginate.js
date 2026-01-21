/**
 * Pagination Middleware
 * Production-level middleware for handling pagination in API requests
 * Parses and validates pagination parameters from query string
 */

const { STATUS_CODES } = require('../config/constants');

/**
 * Middleware to parse and validate pagination parameters
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Returns next() on success or error response on failure
 * 
 * @description
 * Extracts page and limit from query parameters
 * Validates values and sets defaults if missing
 * Attaches pagination object to req.pagination with limit and offset
 * 
 * @example
 * router.get('/products', paginate, getProducts);
 */
const paginate = (req, res, next) => {
  try {
    // Parse page number from query (default: 1, min: 1)
    const page = Math.max(1, Number(req.query?.page) || 1);
    
    // Parse limit from query (default: 10, min: 1, max: 100)
    const limit = Math.min(100, Math.max(1, Number(req.query?.limit) || 10));
    
    // Calculate offset for database queries
    const offset = (page - 1) * limit;

    // Attach pagination data to request object
    req.pagination = {
      page,
      limit,
      offset
    };

    // Proceed to next middleware/route handler
    return next();
  } catch (error) {
    // Handle any unexpected errors in the middleware
    console.error('Error in paginate middleware:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An error occurred while processing pagination parameters',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Helper function to format paginated response
 * 
 * @param {Array} rows - Array of data rows
 * @param {Number} count - Total count of records
 * @param {Number} pageNo - Current page number
 * @param {Number} limitPerPage - Number of items per page
 * @returns {Object} Formatted paginated response object
 * 
 * @description
 * Creates a standardized paginated response structure
 * Includes data array and pagination metadata
 * 
 * @example
 * const response = paginatedResponse(products, totalCount, page, limit);
 * res.json(response);
 */
const paginatedResponse = (rows, count, pageNo, limitPerPage) => {
  try {
    const page = pageNo || 1;
    const limit = limitPerPage || 10;
    const total = Number(count) || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: rows || [],
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error in paginatedResponse helper:', error);
    // Return safe fallback response
    return {
      success: true,
      data: rows || [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    };
  }
};

module.exports = {
  paginate,
  paginatedResponse,
};