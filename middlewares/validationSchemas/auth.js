const Joi = require("joi");

// Sign-up validation schema
const signUpSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.base": "Email must be a string",
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).optional().allow(null, "").messages({
    "string.base": "Phone must be a string",
    "string.pattern.base": "Phone must be a valid phone number",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password must not exceed 100 characters",
    "any.required": "Password is required",
  }),
});

// Login validation schema (email or phone with password)
const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().optional().allow("").messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).optional().allow("").messages({
    "string.pattern.base": "Phone must be a valid phone number",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
}).or("email", "phone").messages({
  "object.missing": "Either email or phone number is required",
});

// Admin login validation schema (same as login)
const adminLoginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().optional().allow("").messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).optional().allow("").messages({
    "string.pattern.base": "Phone must be a valid phone number",
  }),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
}).or("email", "phone").messages({
  "object.missing": "Either email or phone number is required",
});

// Request OTP validation schema
const requestOTPSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().optional().allow("").messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).optional().allow("").messages({
    "string.pattern.base": "Phone must be a valid phone number",
  }),
}).or("email", "phone").messages({
  "object.missing": "Either email or phone number is required",
});

// Verify OTP validation schema
const verifyOTPSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().optional().allow("").messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]+$/).optional().allow("").messages({
    "string.pattern.base": "Phone must be a valid phone number",
  }),
  otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
    "string.base": "OTP must be a string",
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only numbers",
    "any.required": "OTP is required",
  }),
}).or("email", "phone").messages({
  "object.missing": "Either email or phone number is required",
});

module.exports = {
  signUpSchema,
  loginSchema,
  adminLoginSchema,
  requestOTPSchema,
  verifyOTPSchema,
};

