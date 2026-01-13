/**
 * @swagger
 * /product/variant/{productId}:
 *   post:
 *     summary: Create a new product variant (Admin Only)
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     description: Only Super Admin can create variants. Regular users can only view variants.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantsName
 *               - value
 *               - price
 *             properties:
 *               variantsName:
 *                 type: string
 *                 description: Variant name (e.g., Color, Size, Material)
 *                 example: "Color"
 *               value:
 *                 type: string
 *                 description: Variant value (e.g., Red, Large, Cotton)
 *                 example: "Red"
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Price for this variant
 *                 example: 29.99
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Product not found
 *       403:
 *         description: Only Super Admin can perform this action
 * 
 *   get:
 *     summary: Get all variants for a product
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     description: All authenticated users can view variants
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Variants fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /product/variant/all:
 *   get:
 *     summary: Get all variants with pagination
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     description: All authenticated users can view variants
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by variant name
 *     responses:
 *       200:
 *         description: Variants fetched successfully
 */

/**
 * @swagger
 * /product/variant:
 *   get:
 *     summary: Get all variants with pagination
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     description: All authenticated users can view variants
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variants fetched successfully
 */

/**
 * @swagger
 * /product/variant/{variantId}:
 *   patch:
 *     summary: Update a product variant (Admin Only)
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     description: Only Super Admin can update variants. Regular users can only view variants.
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variantsName:
 *                 type: string
 *                 description: Variant name
 *               value:
 *                 type: string
 *                 description: Variant value
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Variant price
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *       404:
 *         description: Variant not found
 *       403:
 *         description: Only Super Admin can perform this action
 * 
 *   delete:
 *     summary: Delete a product variant (Admin Only)
 *     tags: [Product Variants]
 *     security:
 *       - bearerAuth: []
 *     description: Only Super Admin can delete variants. Regular users can only view variants.
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *       404:
 *         description: Variant not found
 *       403:
 *         description: Only Super Admin can perform this action
 */
