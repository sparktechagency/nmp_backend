import express from 'express';
import ContactController from './Contact.controller';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { createContactValidationSchema, replyContactValidationSchema } from './Contact.validation';
import { UserRole } from '../User/user.constant';
import AuthMiddleware from '../../middlewares/AuthMiddleware';

const router = express.Router();

router.post(
  '/create-contact',
  validationMiddleware(createContactValidationSchema),
  ContactController.createContact,
);

router.patch(
  '/reply/:contactId',
  AuthMiddleware('admin', 'super_admin'),
  validationMiddleware(replyContactValidationSchema),
  ContactController.replyContact,
);

router.delete(
  '/delete-contact/:contactId',
  ContactController.deleteContact,
);

router.get(
  '/get-contacts',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  ContactController.getAllContacts,
);

const ContactRoutes = router;
export default ContactRoutes;
