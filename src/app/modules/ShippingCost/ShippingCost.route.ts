import express from 'express';
import ShippingCostController from './ShippingCost.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createShippingCostValidationSchema, updateShippingCostValidationSchema } from './ShippingCost.validation';

const router = express.Router();

router.post(
  '/create-shippingcost',
  validationMiddleware(createShippingCostValidationSchema),
  ShippingCostController.createShippingCost,
);

router.get(
  '/get-single-shippingcost/:shippingcostId',
  ShippingCostController.getSingleShippingCost,
);

router.patch(
  '/update-shippingcost/:shippingcostId',
  validationMiddleware(updateShippingCostValidationSchema),
  ShippingCostController.updateShippingCost,
);

router.delete(
  '/delete-shippingcost/:shippingcostId',
  ShippingCostController.deleteShippingCost,
);

router.get(
  '/get-all-shippingcosts',
  ShippingCostController.getAllShippingCosts,
);

const ShippingCostRoutes = router;
export default ShippingCostRoutes;
