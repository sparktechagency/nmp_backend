import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import CategoryController from './Category.controller';
import { categoryValidationSchema } from './Category.validation';

const router = express.Router();

router.post(
  "/create-category",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(categoryValidationSchema),
  CategoryController.createCategory
);
router.get(
  '/get-categories',
  CategoryController.getCategories,
);
router.get(
  "/get-category-drop-down",
  CategoryController.getCategoryDropDown
);
router.patch(
  "/update-category/:categoryId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(categoryValidationSchema),
  CategoryController.updateCategory
);
router.delete(
  "/delete-category/:categoryId",
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  CategoryController.deleteCategory
);


const CategoryRoutes = router;
export default CategoryRoutes;