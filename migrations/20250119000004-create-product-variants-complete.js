'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create sequence for SKU
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS product_variant_sku_seq START 1;
    `);

    await queryInterface.createTable('productVariants', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true,
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      variantsName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.literal("'SKU-' || LPAD(nextval('product_variant_sku_seq')::text, 6, '0')"),
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

    // Add indexes for better performance
    await queryInterface.addIndex('productVariants', ['productId']);
    await queryInterface.addIndex('productVariants', ['sku']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('productVariants');
    // Drop sequence
    await queryInterface.sequelize.query(`
      DROP SEQUENCE IF EXISTS product_variant_sku_seq;
    `);
  }
};
