import mongoose, { Types } from "mongoose";
import ApiError from "../../errors/ApiError";
import { IReviewPayload, TReviewQuery } from "./review.interface";
import ReviewModel from "./review.model";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { ReviewSearchFields } from "./review.constant";
import OrderModel from "../Order/Order.model";
import ObjectId from "../../utils/ObjectId";
import ProductModel from "../Product/Product.model";


const createReviewService = async (
  loginUserId: string,
  payload: IReviewPayload
) => {
  
  const { orderId, productId, star, comment } = payload;
   if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  //check order
   const order = await OrderModel.findOne({
    _id: orderId,
    userId: loginUserId
   });
  if (!order) {
    throw new ApiError(404, "Order Not Found");
  }

  if(order.status !== "delivered"){
    throw new ApiError(409, "Your order has not been delivered yet");
  }

  
  const orderProducts = order?.products;

  //check productId is not associated with this order
  const existingProduct = orderProducts?.find((cv)=> cv.productId.toString() === productId.toString());
  if(!existingProduct){
    throw new ApiError(400, "This product is not associated with this order");
  }

  //check if you already put the comment
  const review = await ReviewModel.findOne({
    userId: loginUserId,
    orderId,
    productId
  })

  if(review){
    throw new ApiError(409, "You have already reviewed this product");
  }

  //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create a new review
    await ReviewModel.create(
      [{
        userId: loginUserId,
        orderId,
        productId,
        star,
        comment,
      }],
      { session }
    );

    //find the average ratings value
    const averageRatingsResult = await ReviewModel.aggregate(
      [
        {
          $match: { productId: new ObjectId(productId) },
        },
        {
          $group: {
            _id: "$productId",
            averageRating: { $avg: "$star" },
          },
        },
      ],
      { session }
    );

    const averageRatings =
      averageRatingsResult.length > 0
        ? Number((averageRatingsResult[0]?.averageRating).toFixed(1))
        : product.ratings;

    //update the ratings
    const result = await ProductModel.updateOne(
      { _id: new ObjectId(productId) },
      { ratings: averageRatings },
      { session }
    );

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};


const deleteReviewService = async (loginUserId: string, reviewId: string) => {
  const ObjectId = Types.ObjectId;  

   //check review not exist
   const review = await ReviewModel.findOne({
    _id: reviewId,
    ownerId: loginUserId
   });
   if (!review) {
     throw new ApiError(404, "Review Not Found");
   }

   //delete the review
   const result = await ReviewModel.deleteOne({
    _id: new ObjectId(reviewId),
    ownerId : new ObjectId(loginUserId)
   })

   return result;
}


const getUserProductReviewService = async (productId: string, query: TReviewQuery) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }
  const ObjectId = Types.ObjectId;
    
  // 1. Extract query parameters
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters // Any additional filters
  } = query;


  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
      searchQuery = makeSearchQuery(searchTerm, ReviewSearchFields);
    }
  
    //5 setup filters
    let filterQuery = {};
    if (filters) {
      filterQuery = makeFilterQuery(filters);
    }

    
  const result = await ReviewModel.aggregate([
    {
      $match: { productId: new ObjectId(productId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    {
      $project: {
        _id:0,
        fullName: "$user.fullName",
        star: "$star",
        comment: "$comment",
        createdAt: "$createdAt",
      }
    },
    { $sort: { [sortBy]: sortDirection } },
    { $skip: skip },
    { $limit: Number(limit) },
  ])

   // total count of matching users 
  const totalReviewResult = await ReviewModel.aggregate([
    {
      $match: { productId: new ObjectId(productId) }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
   
}


const getTestimonialsService = async () => {
  const result = await ReviewModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user"
    },
    { $sort: { ratings: -1, createdAt: -1 } },
    { $skip: 5 },
    {
      $project: {
        _id: 0,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        star: "$star",
        comment: "$comment",
        createdAt: "$createdAt",
      }
    },
  ])

  return result;
}

export {
    createReviewService,
    deleteReviewService,
    getUserProductReviewService,
    getTestimonialsService
}