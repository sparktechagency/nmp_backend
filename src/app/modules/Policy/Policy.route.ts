import express from 'express';
import PolicyController from './Policy.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createPolicyValidationSchema } from './Policy.validation';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();

router.patch(
  '/create-update-policy',
  AuthMiddleware("super_admin", "admin"),
  validationMiddleware(createPolicyValidationSchema),
  PolicyController.createUpdatePolicy,
);


router.get(
  '/get-policy-by-type/:type',
  PolicyController.getPolicyByType,
);


const PolicyRoutes = router;
export default PolicyRoutes;
