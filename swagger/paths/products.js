/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product (Admin Only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Only Super Admin can create products. Regular users can only view products.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: "iPhone 15 Pro"
 *               desc:
 *                 type: string
 *                 description: Product description
 *                 example: "Latest iPhone with advanced features"
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *                 description: Product active status
 *                 default: true
 *               basePrice:
 *                 type: number
 *                 format: decimal
 *                 description: Base price of the product
 *                 example: 999.99
 *                 default: 0.00
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Only Super Admin can perform this action
 * 
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: All authenticated users can view products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: All authenticated users can view products
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
 *         description: Product fetched successfully
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
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 * 
 *   patch:
 *     summary: Update a product (Admin Only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Only Super Admin can update products. Regular users can only view products.
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *               desc:
 *                 type: string
 *                 description: Product description
 *                 nullable: true
 *               isActive:
 *                 type: boolean
 *                 description: Product active status
 *               basePrice:
 *                 type: number
 *                 format: decimal
 *                 description: Base price of the product
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Only Super Admin can perform this action
 * 
 *   delete:
 *     summary: Delete a product (Admin Only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     description: Only Super Admin can delete products. Regular users can only view products.
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       403:
 *         description: Only Super Admin can perform this action
 */
