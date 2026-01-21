import { Router } from "express";
import cartService from "../../services/cart";
import { validate, validateParams } from "../../middlewares/validator";
import {
  addItemToCartSchema,
  updateCartItemSchema,
  itemIdParamSchema,
} from "../../middlewares/validationSchemas";

const router = Router();

// Swagger documentation is in swagger/paths/cart.js

router.get("/cart", cartService.getOrCreateCart);
router.post("/cart/item", validate(addItemToCartSchema), cartService.addItemToCart);
router.patch("/cart/item/:itemId", validateParams(itemIdParamSchema), validate(updateCartItemSchema), cartService.updateCartItem);
router.delete("/cart/item/:itemId", validateParams(itemIdParamSchema), cartService.removeCartItem);
router.delete("/cart/clear", cartService.clearCart);

export default router;

