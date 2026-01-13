const Joi = require("joi");

// Checkout validation schema
const checkoutSchema = Joi.object({
  paymentMethod: Joi.string()
    .valid("cash", "card", "online", "wallet")
    .required()
    .messages({
      "string.base": "Payment method must be a string",
      "any.only": "Payment method must be one of: cash, card, online, wallet",
      "any.required": "Payment method is required",
    }),
  shippingAddress: Joi.object({
    street: Joi.string().trim().optional().allow("", null),
    city: Joi.string().trim().optional().allow("", null),
    state: Joi.string().trim().optional().allow("", null),
    zip: Joi.string().trim().optional().allow("", null),
    country: Joi.string().trim().optional().allow("", null),
  })
    .optional()
    .allow(null)
    .messages({
      "object.base": "Shipping address must be an object",
    }),
});

// Order ID parameter validation
const orderIdParamSchema = Joi.object({
  orderId: Joi.string().uuid().required().messages({
    "string.guid": "Order ID must be a valid UUID",
    "any.required": "Order ID is required",
  }),
});

module.exports = {
  checkoutSchema,
  orderIdParamSchema,
};

