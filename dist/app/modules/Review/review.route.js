"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const review_controller_1 = __importDefault(require("./review.controller"));
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
router.post('/create-review', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.user), (0, validationMiddleware_1.default)(review_validation_1.createReviewValidationSchema), review_controller_1.default.createReview);
router.delete('/delete-review/:reviewId', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), review_controller_1.default.deleteReview);
router.get('/get-user-product-reviews/:productId', review_controller_1.default.getUserProductReviews);
router.get('/get-testimonials', review_controller_1.default.getTestimonials);
const ReviewRoutes = router;
exports.default = ReviewRoutes;
