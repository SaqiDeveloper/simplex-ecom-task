import { Router } from "express";
import authService from "../../services/auth";
import { validate } from "../../middlewares/validator";
import { signUpSchema, loginSchema, adminLoginSchema, requestOTPSchema, verifyOTPSchema } from "../../middlewares/validationSchemas";

// Swagger documentation is in swagger/paths/auth.js

const router = Router();

router.post("/sign-up", validate(signUpSchema), authService.signUp);
router.post("/login", validate(loginSchema), authService.login);
router.post("/admin/login", validate(adminLoginSchema), authService.adminLogin);
router.post("/otp/request", validate(requestOTPSchema), authService.requestOTP);
router.post("/otp/verify", validate(verifyOTPSchema), authService.verifyOTP);

export default router;

