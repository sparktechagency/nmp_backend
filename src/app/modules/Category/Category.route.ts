import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import CategoryController from './Category.controller';
import { createCategoryValidationSchema, updateCategoryValidationSchema } from './Category.validation';

const router = express.Router();

router.post(
  "/create-category",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(createCategoryValidationSchema),
  CategoryController.createCategory
);
router.get(
  '/get-categories',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  CategoryController.getCategories,
);

router.get(
  '/get-export-categories',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  CategoryController.getExportCategories,
);
router.get(
  "/get-category-drop-down/:typeId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  CategoryController.getCategoryDropDown
);
router.patch(
  "/update-category/:categoryId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(updateCategoryValidationSchema),
  CategoryController.updateCategory
);
router.delete(
  "/delete-category/:categoryId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  CategoryController.deleteCategory
);


const CategoryRoutes = router;
export default CategoryRoutes;