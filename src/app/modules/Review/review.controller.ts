import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { ReviewValidFields } from "./review.constant";
import { createReviewService, deleteReviewService, getTestimonialsService, getUserProductReviewService } from "./review.service";



const createReview = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createReviewService(
    loginUserId as string,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review is created successfully",
    data: result,
  });
});




const deleteReview = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { reviewId } = req.params;
  const result = await deleteReviewService(
    loginUserId as string,
    reviewId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review is deleted successfully",
    data: result,
  });
});


const getUserProductReviews = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const validatedQuery = pickValidFields(req.query, ReviewValidFields);
  const result = await getUserProductReviewService(
    productId,
    validatedQuery
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reviews are retrived successfully",
    meta: result.meta,
    data: result.data,
  });
});


const getTestimonials = catchAsync(async (req, res) => {
  const result = await getTestimonialsService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Testimonials are retrived successfully",
    data: result
  });
});


const ReviewController = {
    createReview,
    deleteReview,
    getUserProductReviews,
    getTestimonials
 }
 
 export default ReviewController;