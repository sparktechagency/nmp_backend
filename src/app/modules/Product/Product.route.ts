import express from 'express';
import ProductController from './Product.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { updateProductValidationSchema } from './Product.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import upload from '../../helper/upload';

const router = express.Router();

router.post(
  '/create-product',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  upload.single("image"),
  ProductController.createProduct,
);

router.get(
  '/get-single-product/:productId',
  ProductController.getSingleProduct,
);

router.get(
  '/get-product/:productId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ProductController.getProduct,
);

router.patch(
  '/update-product/:productId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(updateProductValidationSchema),
  ProductController.updateProduct,
);

router.patch(
  '/update-product-img/:productId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
   upload.single("image"),
  ProductController.updateProductImg,
);

router.delete(
  '/delete-product/:productId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ProductController.deleteProduct,
);

router.get(
  '/get-user-products',
  ProductController.getUserProducts,
);
router.get(
  '/get-export-products',
  ProductController.getExportsProducts,
);

router.get(
  '/get-best-seller-products',
  ProductController.getBestSellerProducts
);
router.get(
  '/get-feature-products',
  ProductController.getFeatureProducts
);

router.get(
  '/get-products',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ProductController.getProducts,
);

const ProductRoutes = router;
export default ProductRoutes;
