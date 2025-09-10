import express from 'express';
import ShippingCostController from './ShippingCost.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createShippingCostValidationSchema, updateShippingCostValidationSchema } from './ShippingCost.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.post(
  '/create-shipping-cost',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(createShippingCostValidationSchema),
  ShippingCostController.createShippingCost,
);

router.get(
  '/get-my-shipping-cost',
  AuthMiddleware("user"),
  ShippingCostController.getMyShippingCost,
);

router.patch(
  '/update-shipping-cost/:shippingCostId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(updateShippingCostValidationSchema),
  ShippingCostController.updateShippingCost,
);

router.delete(
  '/delete-shipping-cost/:shippingCostId',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ShippingCostController.deleteShippingCost,
);

router.get(
  '/get-all-shipping-costs',
   AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ShippingCostController.getAllShippingCosts,
);

const ShippingCostRoutes = router;
export default ShippingCostRoutes;
