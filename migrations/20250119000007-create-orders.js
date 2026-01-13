'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create sequence for order number
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
    `);

    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.literal("'ORD-' || LPAD(nextval('order_number_seq')::text, 8, '0')"),
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      shippingAddress: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('orders', ['userId']);
    await queryInterface.addIndex('orders', ['cartId']);
    await queryInterface.addIndex('orders', ['orderNumber']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['paymentStatus']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS order_number_seq;
    `);
  }
};

