/**
 * Environment Variables Validation
 * Validates all required environment variables at application startup
 * Fails fast if any required variable is missing or invalid
 */

const Joi = require('joi');

/**
 * Environment variable schema definition
 * Defines required and optional variables with their validation rules
 */
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65535).required(),

  // Database Configuration
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().integer().min(1).max(65535).default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // JWT Configuration
  JWT_SECRETE_KEY: Joi.string().min(10).required()
    .messages({
      'string.min': 'JWT_SECRETE_KEY must be at least 10 characters long (32+ strongly recommended for production)',
      'any.required': 'JWT_SECRETE_KEY is required for authentication'
    }),

  // Redis Configuration (optional for development)
  REDIS_HOST: Joi.string().hostname().default('localhost'),
  REDIS_PORT: Joi.number().integer().min(1).max(65535).default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
})
  .unknown(true); // Allow unknown environment variables (system vars, etc.)

/**
 * Validates environment variables against the schema
 * @throws {Error} If validation fails
 * @returns {Object} Validated and sanitized environment variables
 */
const validateEnv = () => {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false, // Collect all errors, don't stop at first
    stripUnknown: false, // Keep unknown keys (system environment variables)
    allowUnknown: true, // Allow unknown environment variables
  });

  if (error) {
    const errorMessages = error.details.map((detail) => {
      return `${detail.path.join('.')}: ${detail.message}`;
    }).join('\n');

    throw new Error(
      `Environment variable validation failed:\n${errorMessages}\n\n` +
      'Please check your .env file and ensure all required variables are set correctly.'
    );
  }

  return value;
};

/**
 * Validates environment variables and logs success
 * Should be called at application startup
 */
const validateAndLog = () => {
  try {
    const validated = validateEnv();
    
    console.log('✓ Environment variables validated successfully');
    console.log(`✓ Running in ${validated.NODE_ENV} mode`);
    console.log(`✓ Server will start on port ${validated.PORT}`);
    
    return validated;
  } catch (error) {
    console.error('✗ Environment validation failed:');
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = {
  validateEnv,
  validateAndLog,
  envSchema,
};

