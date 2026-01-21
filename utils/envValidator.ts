import Joi from 'joi';

interface EnvVariables {
  NODE_ENV: 'development' | 'production' | 'test' | 'staging';
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRETE_KEY: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
}

const envSchema = Joi.object<EnvVariables>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65535).required(),

  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().integer().min(1).max(65535).default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRETE_KEY: Joi.string().min(10).required()
    .messages({
      'string.min': 'JWT_SECRETE_KEY must be at least 10 characters long (32+ strongly recommended for production)',
      'any.required': 'JWT_SECRETE_KEY is required for authentication'
    }),

  REDIS_HOST: Joi.string().hostname().default('localhost'),
  REDIS_PORT: Joi.number().integer().min(1).max(65535).default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
})
  .unknown(true);

export const validateEnv = (): EnvVariables => {
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: false,
    allowUnknown: true,
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

  return value as EnvVariables;
};

export const validateAndLog = (): EnvVariables => {
  try {
    const validated = validateEnv();
    
    console.log('✓ Environment variables validated successfully');
    console.log(`✓ Running in ${validated.NODE_ENV} mode`);
    console.log(`✓ Server will start on port ${validated.PORT}`);
    
    return validated;
  } catch (error) {
    console.error('✗ Environment validation failed:');
    console.error((error as Error).message);
    process.exit(1);
  }
};

export { envSchema };

