import express from 'express';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { UserRole } from '../User/user.constant';
import validationMiddleware from '../../middlewares/validationMiddleware';
import ReviewController from './review.controller';
import { createReviewValidationSchema } from './review.validation';

const router = express.Router();

router.post('/create-review', AuthMiddleware(UserRole.user), validationMiddleware(createReviewValidationSchema), ReviewController.createReview);
router.delete('/delete-review/:reviewId', AuthMiddleware(UserRole.admin, UserRole.super_admin), ReviewController.deleteReview)
router.get('/get-user-product-reviews/:productId', ReviewController.getUserProductReviews);
router.get('/get-testimonials',  ReviewController.getTestimonials);


const ReviewRoutes = router;
export default ReviewRoutes;