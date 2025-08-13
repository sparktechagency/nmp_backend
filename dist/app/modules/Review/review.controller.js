"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const review_constant_1 = require("./review.constant");
const review_service_1 = require("./review.service");
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, review_service_1.createReviewService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Review is created successfully",
        data: result,
    });
}));
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { reviewId } = req.params;
    const result = yield (0, review_service_1.deleteReviewService)(loginUserId, reviewId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Review is deleted successfully",
        data: result,
    });
}));
const getUserProductReviews = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, review_constant_1.ReviewValidFields);
    const result = yield (0, review_service_1.getUserProductReviewService)(productId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Reviews are retrived successfully",
        meta: result.meta,
        data: result.data,
    });
}));
const getTestimonials = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, review_service_1.getTestimonialsService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Testimonials are retrived successfully",
        data: result
    });
}));
const ReviewController = {
    createReview,
    deleteReview,
    getUserProductReviews,
    getTestimonials
};
exports.default = ReviewController;
