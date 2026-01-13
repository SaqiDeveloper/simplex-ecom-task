const Joi = require("joi");

// Create product variant validation schema
const createVariantSchema = Joi.object({
  variantsName: Joi.string().trim().min(1).max(255).required().messages({
    "string.base": "Variant name must be a string",
    "string.empty": "Variant name cannot be empty",
    "string.min": "Variant name must be at least 1 character long",
    "string.max": "Variant name must not exceed 255 characters",
    "any.required": "Variant name is required",
  }),
  value: Joi.string().trim().min(1).max(255).required().messages({
    "string.base": "Value must be a string",
    "string.empty": "Value cannot be empty",
    "string.min": "Value must be at least 1 character long",
    "string.max": "Value must not exceed 255 characters",
    "any.required": "Value is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be 0 or greater",
    "any.required": "Price is required",
  }),
});

// Update product variant validation schema
const updateVariantSchema = Joi.object({
  variantsName: Joi.string().trim().min(1).max(255).optional().messages({
    "string.base": "Variant name must be a string",
    "string.empty": "Variant name cannot be empty",
    "string.min": "Variant name must be at least 1 character long",
    "string.max": "Variant name must not exceed 255 characters",
  }),
  value: Joi.string().trim().min(1).max(255).optional().messages({
    "string.base": "Value must be a string",
    "string.empty": "Value cannot be empty",
    "string.min": "Value must be at least 1 character long",
    "string.max": "Value must not exceed 255 characters",
  }),
  price: Joi.number().min(0).optional().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be 0 or greater",
  }),
});

// Variant ID parameter validation
const variantIdParamSchema = Joi.object({
  variantId: Joi.string().uuid().required().messages({
    "string.guid": "Variant ID must be a valid UUID",
    "any.required": "Variant ID is required",
  }),
});

// Product ID parameter validation (for variant routes)
const productIdParamSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),
});

module.exports = {
  createVariantSchema,
  updateVariantSchema,
  variantIdParamSchema,
  productIdParamSchema,
};

