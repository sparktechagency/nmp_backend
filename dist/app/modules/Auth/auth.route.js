"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const auth_validation_1 = require("./auth.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const user_validation_1 = require("../User/user.validation");
const router = express_1.default.Router();
router.post("/register", (0, validationMiddleware_1.default)(user_validation_1.createUserValidationSchema), auth_controller_1.default.registerUser);
router.post("/verify-email", (0, validationMiddleware_1.default)(auth_validation_1.forgotPassVerifyOtpSchema), auth_controller_1.default.verifyEmail);
router.post("/resend-verify-email", (0, validationMiddleware_1.default)(auth_validation_1.resendVerifyEmailSchema), auth_controller_1.default.resendVerifyEmail);
router.post("/login", (0, validationMiddleware_1.default)(auth_validation_1.loginValidationSchema), auth_controller_1.default.loginUser);
router.post("/login-admin", (0, validationMiddleware_1.default)(auth_validation_1.loginValidationSchema), auth_controller_1.default.loginAdmin);
//forgot-password
router.post("/forgot-pass-send-otp", (0, validationMiddleware_1.default)(auth_validation_1.forgotPassSendOtpSchema), auth_controller_1.default.forgotPassSendOtp);
router.post("/forgot-pass-verify-otp", (0, validationMiddleware_1.default)(auth_validation_1.forgotPassVerifyOtpSchema), auth_controller_1.default.forgotPassVerifyOtp);
router.post("/forgot-pass-create-new-pass", (0, validationMiddleware_1.default)(auth_validation_1.forgotPassCreateNewPassSchema), auth_controller_1.default.forgotPassCreateNewPass);
router.patch("/change-password", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.user, user_constant_1.UserRole.admin), (0, validationMiddleware_1.default)(auth_validation_1.changePasswordSchema), auth_controller_1.default.changePassword);
router.patch("/change-status/:id", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.admin), (0, validationMiddleware_1.default)(auth_validation_1.changeStatusValidationSchema), auth_controller_1.default.changeStatus);
router.patch("/change-owner-status/:id", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.super_admin, user_constant_1.UserRole.admin), (0, validationMiddleware_1.default)(auth_validation_1.changeStatusValidationSchema), auth_controller_1.default.changeStatus);
router.delete("/delete-my-account", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(auth_validation_1.deleteAccountValidationSchema), auth_controller_1.default.deleteMyAccount);
router.post("/refresh-token", (0, validationMiddleware_1.default)(auth_validation_1.refreshTokenValidationSchema), auth_controller_1.default.refreshToken);
exports.AuthRoutes = router;
