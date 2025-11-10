import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { countDownDateSchema, createInformationValidationSchema, mapLocationSchema } from './Information.validation';
import { UserRole } from '../User/user.constant';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import InformationController from './Information.controller';
import upload from '../../helper/upload';

const router = express.Router();

router.patch(
  '/create-update-information',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(createInformationValidationSchema),
  InformationController.createInformation,
);

router.get(
  '/get-information',
  InformationController.getInformation
);

router.patch(
  '/update-hero-img',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  upload.single("image"),
  InformationController.updateHeroImg,
);

router.patch(
  '/update-count-down-img',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  upload.single("image"),
  InformationController.updateCountDownImg,
);

router.patch(
  '/update-count-down-time',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(countDownDateSchema),
  InformationController.updateCountDownTime,
);

router.patch(
  '/update-map-location',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(mapLocationSchema),
  InformationController.updateMapLocation,
);


const InformationRoutes = router;
export default InformationRoutes;
