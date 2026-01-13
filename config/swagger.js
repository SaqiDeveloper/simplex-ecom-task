const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for E-Commerce POS System',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID',
            },
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            phone: {
              type: 'string',
              description: 'User phone number',
            },
            isSuperAdmin: {
              type: 'boolean',
              description: 'Is super admin',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Product ID',
            },
            name: {
              type: 'string',
              description: 'Product name',
            },
            desc: {
              type: 'string',
              description: 'Product description',
              nullable: true,
            },
            isActive: {
              type: 'boolean',
              description: 'Product active status',
              default: true,
            },
            basePrice: {
              type: 'number',
              format: 'decimal',
              description: 'Base price of the product',
              default: 0.00,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        ProductVariant: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Variant ID',
            },
            productId: {
              type: 'string',
              format: 'uuid',
              description: 'Product ID (foreign key)',
            },
            variantsName: {
              type: 'string',
              description: 'Variant name (e.g., Color, Size)',
            },
            value: {
              type: 'string',
              description: 'Variant value (e.g., Red, Large)',
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Price for this variant',
            },
            sku: {
              type: 'string',
              description: 'SKU (auto-generated, format: SKU-000001)',
              readOnly: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
            },
            message: {
              type: 'string',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            statusCode: {
              type: 'integer',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                    },
                    limit: {
                      type: 'integer',
                    },
                    total: {
                      type: 'integer',
                    },
                    totalPages: {
                      type: 'integer',
                    },
                  },
                },
              },
            },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Cart ID',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID',
            },
            status: {
              type: 'string',
              enum: ['active', 'completed', 'abandoned'],
              description: 'Cart status',
              default: 'active',
            },
            totalAmount: {
              type: 'number',
              format: 'decimal',
              description: 'Total amount in cart',
              default: 0.00,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            CartItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem',
              },
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Cart Item ID',
            },
            cartId: {
              type: 'string',
              format: 'uuid',
              description: 'Cart ID',
            },
            productId: {
              type: 'string',
              format: 'uuid',
              description: 'Product ID',
            },
            variantId: {
              type: 'string',
              format: 'uuid',
              description: 'Product Variant ID (optional)',
              nullable: true,
            },
            quantity: {
              type: 'integer',
              description: 'Quantity',
              minimum: 1,
            },
            price: {
              type: 'number',
              format: 'decimal',
              description: 'Price per unit',
            },
            subtotal: {
              type: 'number',
              format: 'decimal',
              description: 'Subtotal (quantity × price)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            Product: {
              $ref: '#/components/schemas/Product',
            },
            Variant: {
              $ref: '#/components/schemas/ProductVariant',
              nullable: true,
            },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Order ID',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'User ID',
            },
            cartId: {
              type: 'string',
              format: 'uuid',
              description: 'Cart ID',
            },
            orderNumber: {
              type: 'string',
              description: 'Order number (auto-generated, format: ORD-00000001)',
              readOnly: true,
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'],
              description: 'Order status',
            },
            totalAmount: {
              type: 'number',
              format: 'decimal',
              description: 'Total order amount',
            },
            shippingAddress: {
              type: 'object',
              description: 'Shipping address',
              nullable: true,
            },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
              description: 'Payment status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            OrderItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/OrderItem',
              },
            },
            Payments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Payment',
              },
            },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            orderId: {
              type: 'string',
              format: 'uuid',
            },
            productId: {
              type: 'string',
              format: 'uuid',
            },
            variantId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
            },
            quantity: {
              type: 'integer',
            },
            price: {
              type: 'number',
              format: 'decimal',
            },
            subtotal: {
              type: 'number',
              format: 'decimal',
            },
            Product: {
              $ref: '#/components/schemas/Product',
            },
            Variant: {
              $ref: '#/components/schemas/ProductVariant',
              nullable: true,
            },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            orderId: {
              type: 'string',
              format: 'uuid',
            },
            userId: {
              type: 'string',
              format: 'uuid',
            },
            amount: {
              type: 'number',
              format: 'decimal',
            },
            paymentMethod: {
              type: 'string',
              enum: ['cash', 'card', 'online', 'wallet'],
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
            },
            transactionId: {
              type: 'string',
              nullable: true,
            },
            paymentDetails: {
              type: 'object',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    // Security is applied per endpoint, not globally
  },
  apis: [
    './swagger/paths/*.js',  // Module-wise swagger documentation
    './controllers/**/*.js',  // Keep inline comments as fallback
    './routes/**/*.js'
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

