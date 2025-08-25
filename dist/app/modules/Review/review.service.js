"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestimonialsService = exports.getUserProductReviewService = exports.deleteReviewService = exports.createReviewService = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const review_model_1 = __importDefault(require("./review.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const review_constant_1 = require("./review.constant");
const Order_model_1 = __importDefault(require("../Order/Order.model"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const Product_model_1 = __importDefault(require("../Product/Product.model"));
const createReviewService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId, productId, star, comment } = payload;
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    //check product
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    //check order
    const order = yield Order_model_1.default.findOne({
        _id: orderId,
        userId: loginUserId
    });
    if (!order) {
        throw new ApiError_1.default(404, "Order Not Found");
    }
    if (order.status !== "delivered") {
        throw new ApiError_1.default(409, "Your order has not been delivered yet");
    }
    const orderProducts = order === null || order === void 0 ? void 0 : order.products;
    //check productId is not associated with this order
    const existingProduct = orderProducts === null || orderProducts === void 0 ? void 0 : orderProducts.find((cv) => cv.productId.toString() === productId.toString());
    if (!existingProduct) {
        throw new ApiError_1.default(400, "This product is not associated with this order");
    }
    //check if you already put the comment
    const review = yield review_model_1.default.findOne({
        userId: loginUserId,
        orderId,
        productId
    });
    if (review) {
        throw new ApiError_1.default(409, "You have already reviewed this product");
    }
    //transaction & rollback
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Create a new review
        yield review_model_1.default.create([{
                userId: loginUserId,
                orderId,
                productId,
                star,
                comment,
            }], { session });
        //find the average ratings value
        const averageRatingsResult = yield review_model_1.default.aggregate([
            {
                $match: { productId: new ObjectId_1.default(productId) },
            },
            {
                $group: {
                    _id: "$productId",
                    averageRating: { $avg: "$star" },
                },
            },
        ], { session });
        const averageRatings = averageRatingsResult.length > 0
            ? Number(((_a = averageRatingsResult[0]) === null || _a === void 0 ? void 0 : _a.averageRating).toFixed(1))
            : product.ratings;
        //update the ratings
        const result = yield Product_model_1.default.updateOne({ _id: new ObjectId_1.default(productId) }, { ratings: averageRatings }, { session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.createReviewService = createReviewService;
const deleteReviewService = (loginUserId, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    //check review not exist
    const review = yield review_model_1.default.findOne({
        _id: reviewId,
        ownerId: loginUserId
    });
    if (!review) {
        throw new ApiError_1.default(404, "Review Not Found");
    }
    //delete the review
    const result = yield review_model_1.default.deleteOne({
        _id: new ObjectId(reviewId),
        ownerId: new ObjectId(loginUserId)
    });
    return result;
});
exports.deleteReviewService = deleteReviewService;
const getUserProductReviewService = (productId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    //check product
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    const ObjectId = mongoose_1.Types.ObjectId;
    // 1. Extract query parameters
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, review_constant_1.ReviewSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield review_model_1.default.aggregate([
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
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        {
            $project: {
                _id: 0,
                fullName: "$user.fullName",
                star: "$star",
                comment: "$comment",
                createdAt: "$createdAt",
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count of matching users 
    const totalReviewResult = yield review_model_1.default.aggregate([
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
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalReviewResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
});
exports.getUserProductReviewService = getUserProductReviewService;
const getTestimonialsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.default.aggregate([
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
    ]);
    return result;
});
exports.getTestimonialsService = getTestimonialsService;
