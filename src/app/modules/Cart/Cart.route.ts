import express from 'express';
import CartController from './Cart.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createCartValidationSchema, updateCartValidationSchema } from './Cart.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();

router.post(
  '/create-cart',
  AuthMiddleware("user"),
  validationMiddleware(createCartValidationSchema),
  CartController.createCart,
);

router.get(
  '/get-carts',
  AuthMiddleware("user"),
  CartController.getCarts,
);
router.patch(
  '/update-cart/:cartId',
  AuthMiddleware("user"),
  validationMiddleware(updateCartValidationSchema),
  CartController.updateCart,
);

router.delete(
  '/delete-cart/:cartId',
  AuthMiddleware("user"),
  CartController.deleteCart,
);


const CartRoutes = router;
export default CartRoutes;
