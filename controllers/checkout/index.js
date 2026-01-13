const router = require("express").Router();
const checkoutService = require("../../services/checkout");
const { validate, validateParams } = require("../../middlewares/validator");
const {
  checkoutSchema,
  orderIdParamSchema,
} = require("../../middlewares/validationSchemas");

// Swagger documentation is in swagger/paths/checkout.js

router.post("/checkout", validate(checkoutSchema), checkoutService.checkout);
router.get("/order/:orderId", validateParams(orderIdParamSchema), checkoutService.getOrder);
router.get("/orders", checkoutService.getUserOrders);

module.exports = router;

