import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createInformationValidationSchema } from './Information.validation';
import { UserRole } from '../User/user.constant';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import InformationController from './Information.controller';

const router = express.Router();

router.patch(
  '/create-update-information',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  validationMiddleware(createInformationValidationSchema),
  InformationController.createInformation,
);

router.get(
  '/get-information',
  InformationController.getInformation
);


const InformationRoutes = router;
export default InformationRoutes;
