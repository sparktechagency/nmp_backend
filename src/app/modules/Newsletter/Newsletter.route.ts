import express from 'express';
import validationMiddleware from '../../middlewares/validationMiddleware';
import { newsletterValidationSchema } from './Newsletter.validation';
import NewsletterController from './Newsletter.controller';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';

const router = express.Router();

router.post(
  '/subscribe',
  validationMiddleware(newsletterValidationSchema),
  NewsletterController.subscribeToNewsletter,
);

router.get(
  '/get-subscribers',
  AuthMiddleware(UserRole.admin, UserRole.super_admin),
  NewsletterController.getSubscribers,
);
router.delete(
  '/delete-subscriber/:subscriberId',
  NewsletterController.deleteSubscriber,
);


const NewsletterRoutes = router;
export default NewsletterRoutes;
