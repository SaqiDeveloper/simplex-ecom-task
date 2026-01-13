const { STATUS_CODES } = require("../config/constants");

module.exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMsg = error.details[0].message;
      const err = errorMsg.replace(/"/g, "");
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
        statusCode: STATUS_CODES.BAD_REQUEST, 
        message: err 
      });
    }
    next();
  };
};

// Validate request parameters
module.exports.validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      const errorMsg = error.details[0].message;
      const err = errorMsg.replace(/"/g, "");
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
        statusCode: STATUS_CODES.BAD_REQUEST, 
        message: err 
      });
    }
    next();
  };
};
