const Joi = require("joi");

// Add item to cart validation schema
const addItemToCartSchema = Joi.object({
  productId: Joi.string().uuid().required().messages({
    "string.guid": "Product ID must be a valid UUID",
    "any.required": "Product ID is required",
  }),
  variantId: Joi.string().uuid().allow(null).optional().messages({
    "string.guid": "Variant ID must be a valid UUID",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
});

// Update cart item validation schema
const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),
});

// Cart item ID parameter validation
const itemIdParamSchema = Joi.object({
  itemId: Joi.string().uuid().required().messages({
    "string.guid": "Item ID must be a valid UUID",
    "any.required": "Item ID is required",
  }),
});

module.exports = {
  addItemToCartSchema,
  updateCartItemSchema,
  itemIdParamSchema,
};

