import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import TypeController from './Type.controller';
import { typeValidationSchema } from './Type.validation';

const router = express.Router();

router.post(
  "/create-type",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(typeValidationSchema),
  TypeController.createType
);
router.get(
  '/get-types',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  TypeController.getTypes,
);
router.get(
  "/get-type-drop-down",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  TypeController.getTypeDropDown
);
router.get(
  "/get-filter-options/:typeId",
  TypeController.getFilterOptions
);
router.patch(
  "/update-type/:typeId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(typeValidationSchema),
  TypeController.updateType
);
router.delete(
  "/delete-type/:typeId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  TypeController.deleteType
);


const TypeRoutes = router;
export default TypeRoutes;