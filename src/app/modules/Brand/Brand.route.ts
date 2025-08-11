import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import BrandController from './Brand.controller';
import { brandValidationSchema } from './Brand.validation';

const router = express.Router();

router.post(
  "/create-brand",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(brandValidationSchema),
  BrandController.createBrand
);
router.get(
  '/get-brands',
  BrandController.getBrands,
);
router.get(
  "/get-brand-drop-down",
  BrandController.getBrandDropDown
);
router.patch(
  "/update-brand/:brandId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(brandValidationSchema),
  BrandController.updateBrand
);
router.delete(
  "/delete-brand/:brandId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  BrandController.deleteBrand
);


const BrandRoutes = router;
export default BrandRoutes;