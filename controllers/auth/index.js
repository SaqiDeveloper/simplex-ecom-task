const router = require("express").Router();
const authService = require("../../services/auth");
const { validate } = require("../../middlewares/validator");
const { signUpSchema, loginSchema, adminLoginSchema, requestOTPSchema, verifyOTPSchema } = require("../../middlewares/validationSchemas");

// Swagger documentation is in swagger/paths/auth.js

router.post("/sign-up", validate(signUpSchema), authService.signUp);
router.post("/login", validate(loginSchema), authService.login);
router.post("/admin/login", validate(adminLoginSchema), authService.adminLogin);
router.post("/otp/request", validate(requestOTPSchema), authService.requestOTP);
router.post("/otp/verify", validate(verifyOTPSchema), authService.verifyOTP);

module.exports = router;
