const Joi = require("joi");

// Create product validation schema
const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must not exceed 255 characters",
    "any.required": "Name is required",
  }),
  desc: Joi.string().trim().allow(null, "").optional().messages({
    "string.base": "Description must be a string",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be 0 or greater",
    "any.required": "Price is required",
  }),
});

// Update product validation schema
const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).optional().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must not exceed 255 characters",
  }),
  desc: Joi.string().trim().allow(null, "").optional().messages({
    "string.base": "Description must be a string",
  }),
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be a boolean",
  }),
  price: Joi.number().min(0).optional().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be 0 or greater",
  }),
});

// Product ID parameter validation
const productIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
};

