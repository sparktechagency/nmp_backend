import express from "express";
import validationMiddleware from "../../middlewares/validationMiddleware";
import {
  changePasswordSchema,
  changeStatusValidationSchema,
  deleteAccountValidationSchema,
  forgotPassCreateNewPassSchema,
  forgotPassSendOtpSchema,
  forgotPassVerifyOtpSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  resendVerifyEmailSchema,
} from "./auth.validation";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import { UserRole } from "../User/user.constant";
import AuthController from "./auth.controller";
import { createUserValidationSchema } from "../User/user.validation";

const router = express.Router();

router.post(
  "/register",
  validationMiddleware(createUserValidationSchema),
  AuthController.registerUser
);

router.get("/verify-email", AuthController.verifyEmail);

router.post(
  "/resend-verify-email",
  validationMiddleware(resendVerifyEmailSchema),
  AuthController.resendVerifyEmail
);

router.post(
  "/login",
  validationMiddleware(loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/login-admin",
  validationMiddleware(loginValidationSchema),
  AuthController.loginAdmin
);

//forgot-password
router.post(
  "/forgot-pass-send-otp",
  validationMiddleware(forgotPassSendOtpSchema),
  AuthController.forgotPassSendOtp
);
router.post(
  "/forgot-pass-verify-otp",
  validationMiddleware(forgotPassVerifyOtpSchema),
  AuthController.forgotPassVerifyOtp
);
router.post(
  "/forgot-pass-create-new-pass",
  validationMiddleware(forgotPassCreateNewPassSchema),
  AuthController.forgotPassCreateNewPass
);

router.patch(
  "/change-password",
  AuthMiddleware(UserRole.super_admin, UserRole.user, UserRole.admin),
  validationMiddleware(changePasswordSchema),
  AuthController.changePassword
);
router.patch(
  "/change-status/:id",
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  validationMiddleware(changeStatusValidationSchema),
  AuthController.changeStatus
);

router.patch(
  "/change-owner-status/:id",
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  validationMiddleware(changeStatusValidationSchema),
  AuthController.changeStatus
);

router.delete(
  "/delete-my-account",
  AuthMiddleware(UserRole.user),
  validationMiddleware(deleteAccountValidationSchema),
  AuthController.deleteMyAccount
);

router.post(
  "/refresh-token",
  validationMiddleware(refreshTokenValidationSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
