import { Router } from "express";
import productService from "../../services/product";
import variantService from "../../services/productVariants";
import { requireRole } from "../../middlewares/admin.middleware";
import { validate, validateParams } from "../../middlewares/validator";
import {
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
  createVariantSchema,
  updateVariantSchema,
  variantIdParamSchema,
  productIdParamSchemaForVariant,
} from "../../middlewares/validationSchemas";

const router = Router();

// Swagger documentation is in swagger/paths/products.js and swagger/paths/variants.js

// Products routes - accessible by admin or super_admin
router.post("/product", requireRole(['admin', 'super_admin']), validate(createProductSchema), productService.createProduct);
router.get("/product/:productId", validateParams(productIdParamSchema), productService.getProduct);
router.get("/product", productService.getAllProducts);
router.patch("/product/:productId", requireRole(['admin', 'super_admin']), validateParams(productIdParamSchema), validate(updateProductSchema), productService.updateProduct);
router.delete("/product/:productId", requireRole(['admin', 'super_admin']), validateParams(productIdParamSchema), productService.deleteProduct);

// Product Variants routes - accessible by admin or super_admin
router.post("/product/variant/:productId", requireRole(['admin', 'super_admin']), validateParams(productIdParamSchemaForVariant), validate(createVariantSchema), variantService.createVariant);
router.get("/product/variant/all", variantService.getAllVariants);
router.get("/product/variant/:productId", validateParams(productIdParamSchemaForVariant), variantService.getVariant);
router.get("/product/variant", variantService.getAllVariants);
router.patch("/product/variant/:variantId", requireRole(['admin', 'super_admin']), validateParams(variantIdParamSchema), validate(updateVariantSchema), variantService.updateVariant);
router.delete("/product/variant/:variantId", requireRole(['admin', 'super_admin']), validateParams(variantIdParamSchema), variantService.deleteVariant);

export default router;

