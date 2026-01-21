import { Router } from "express";
import checkoutService from "../../services/checkout";
import { validate, validateParams } from "../../middlewares/validator";
import {
  checkoutSchema,
  orderIdParamSchema,
} from "../../middlewares/validationSchemas";

const router = Router();

// Swagger documentation is in swagger/paths/checkout.js

router.post("/checkout", validate(checkoutSchema), checkoutService.checkout);
router.get("/order/:orderId", validateParams(orderIdParamSchema), checkoutService.getOrder);
router.get("/orders", checkoutService.getUserOrders);

export default router;

