import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import FlavorController from './Flavor.controller';
import { createFlavorValidationSchema, updateFlavorValidationSchema } from './Flavor.validation';

const router = express.Router();

router.post(
  "/create-flavor",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(createFlavorValidationSchema),
  FlavorController.createFlavor
);
router.get(
  '/get-flavors',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  FlavorController.getFlavors,
);
router.get(
  '/get-export-flavors',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  FlavorController.getExportFlavors,
);
router.get(
  "/get-flavor-drop-down/:typeId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  FlavorController.getFlavorDropDown
);
router.patch(
  "/update-flavor/:flavorId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(updateFlavorValidationSchema),
  FlavorController.updateFlavor
);
router.delete(
  "/delete-flavor/:flavorId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  FlavorController.deleteFlavor
);


const FlavorRoutes = router;
export default FlavorRoutes;