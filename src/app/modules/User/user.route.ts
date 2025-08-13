import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from './user.constant';
import UserController from './user.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { updateProfileValidationSchema } from './user.validation';
import upload from '../../helper/upload';

const router = express.Router();


router.get(
  "/get-users",
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  UserController.getUsers
);
router.get(
  "/get-single-user/:id",
  AuthMiddleware(UserRole.super_admin, UserRole.admin),
  UserController.getSingleUser
);
router.get(
  "/get-my-profile",
  AuthMiddleware(UserRole.super_admin, UserRole.user, UserRole.user, UserRole.admin),
  UserController.getMyProfile
);

router.get(
  "/get-me-for-super-admin",
  AuthMiddleware(UserRole.super_admin),
  UserController.getMeForSuperAdmin
);


router.patch(
  "/edit-my-profile",
   AuthMiddleware(UserRole.super_admin, UserRole.user, UserRole.user, UserRole.admin),
  upload.single('file'),
  validationMiddleware(updateProfileValidationSchema),
  UserController.editMyProfile
);

router.patch(
  "/update-profile-img",
   AuthMiddleware(UserRole.super_admin, UserRole.user, UserRole.user, UserRole.admin),
  upload.single('file'),
  UserController.updateProfileImg
);

router.get('/get-user-overview/:year', AuthMiddleware("super_admin", "admin"), UserController.getUserOverview);


export const UserRoutes = router;
