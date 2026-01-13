const router = require("express").Router();
const cartService = require("../../services/cart");
const { validate, validateParams } = require("../../middlewares/validator");
const {
  addItemToCartSchema,
  updateCartItemSchema,
  itemIdParamSchema,
} = require("../../middlewares/validationSchemas");

// Swagger documentation is in swagger/paths/cart.js

router.get("/cart", cartService.getOrCreateCart);
router.post("/cart/item", validate(addItemToCartSchema), cartService.addItemToCart);
router.patch("/cart/item/:itemId", validateParams(itemIdParamSchema), validate(updateCartItemSchema), cartService.updateCartItem);
router.delete("/cart/item/:itemId", validateParams(itemIdParamSchema), cartService.removeCartItem);
router.delete("/cart/clear", cartService.clearCart);

module.exports = router;

