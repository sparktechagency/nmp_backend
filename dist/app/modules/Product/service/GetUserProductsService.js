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
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../../helper/QueryBuilder");
const Product_constant_1 = require("../Product.constant");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const hasDuplicates_1 = __importDefault(require("../../../utils/hasDuplicates"));
const Product_model_1 = __importDefault(require("../Product.model"));
const GetUserProductsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt", ratings, categoryId, brandId, flavorId, fromPrice, toPrice } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy", "ratings", "categoryId", "brandId", "flavorId", "fromPrice", "toPrice"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    // const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Product_constant_1.ProductSearchableFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    //filter by category
    if (categoryId) {
        if (typeof categoryId === "string") {
            //check ObjectId
            if (!mongoose_1.Types.ObjectId.isValid(categoryId)) {
                throw new ApiError_1.default(400, "categoryId must be valid ObjectId");
            }
            filterQuery = Object.assign(Object.assign({}, filterQuery), { categoryId: { $in: [new mongoose_1.Types.ObjectId(categoryId)] } });
        }
        if (Array.isArray(categoryId)) {
            for (let i = 0; i < categoryId.length; i++) {
                if (!mongoose_1.Types.ObjectId.isValid(categoryId[i])) {
                    throw new ApiError_1.default(400, "categoryId must be valid ObjectId");
                }
            }
            if ((0, hasDuplicates_1.default)(categoryId)) {
                throw new ApiError_1.default(400, "categoryId can not be duplicate value");
            }
            const categoryObjectIds = categoryId === null || categoryId === void 0 ? void 0 : categoryId.map(id => mongoose_1.Types.ObjectId.createFromHexString(id));
            filterQuery = Object.assign(Object.assign({}, filterQuery), { categoryId: { $in: categoryObjectIds } });
        }
    }
    //filter by brand
    if (brandId) {
        if (typeof brandId === "string") {
            //check ObjectId
            if (!mongoose_1.Types.ObjectId.isValid(brandId)) {
                throw new ApiError_1.default(400, "brandId must be valid ObjectId");
            }
            filterQuery = Object.assign(Object.assign({}, filterQuery), { brandId: { $in: [new mongoose_1.Types.ObjectId(brandId)] } });
        }
        if (Array.isArray(brandId)) {
            for (let i = 0; i < brandId.length; i++) {
                if (!mongoose_1.Types.ObjectId.isValid(brandId[i])) {
                    throw new ApiError_1.default(400, "brandId must be valid ObjectId");
                }
            }
            if ((0, hasDuplicates_1.default)(brandId)) {
                throw new ApiError_1.default(400, "brandId can not be duplicate value");
            }
            const brandObjectIds = brandId === null || brandId === void 0 ? void 0 : brandId.map(id => mongoose_1.Types.ObjectId.createFromHexString(id));
            filterQuery = Object.assign(Object.assign({}, filterQuery), { brandId: { $in: brandObjectIds } });
        }
    }
    //filter by flavor
    if (flavorId) {
        if (typeof flavorId === "string") {
            //check ObjectId
            if (!mongoose_1.Types.ObjectId.isValid(flavorId)) {
                throw new ApiError_1.default(400, "flavorId must be valid ObjectId");
            }
            filterQuery = Object.assign(Object.assign({}, filterQuery), { flavorId: { $in: [new mongoose_1.Types.ObjectId(flavorId)] } });
        }
        if (Array.isArray(flavorId)) {
            for (let i = 0; i < flavorId.length; i++) {
                if (!mongoose_1.Types.ObjectId.isValid(flavorId[i])) {
                    throw new ApiError_1.default(400, "flavorId must be valid ObjectId");
                }
            }
            if ((0, hasDuplicates_1.default)(flavorId)) {
                throw new ApiError_1.default(400, "flavorId can not be duplicate value");
            }
            const flavorObjectIds = flavorId === null || flavorId === void 0 ? void 0 : flavorId.map(id => mongoose_1.Types.ObjectId.createFromHexString(id));
            filterQuery = Object.assign(Object.assign({}, filterQuery), { flavorId: { $in: flavorObjectIds } });
        }
    }
    //filter by ratings
    if (ratings) {
        if (typeof Number(ratings) !== "number" || isNaN(Number(ratings))) {
            throw new ApiError_1.default(400, "ratings must be a valid number");
        }
        if (Number(ratings) > 5) {
            throw new ApiError_1.default(400, "ratings value must be between 1-5");
        }
        if (Number(ratings) > 0) {
            filterQuery = Object.assign(Object.assign({}, filterQuery), { ratings: Number(ratings) });
        }
    }
    //filter by price range
    if (fromPrice && toPrice) {
        if (typeof Number(fromPrice) !== "number" || isNaN(Number(fromPrice))) {
            throw new ApiError_1.default(400, "fromPrice must be a valid number");
        }
        if (typeof Number(toPrice) !== "number" || isNaN(Number(toPrice))) {
            throw new ApiError_1.default(400, "toPrice must be a valid number");
        }
        if (Number(fromPrice) >= Number(toPrice)) {
            throw new ApiError_1.default(400, "toPrice must be greater than fromPrice");
        }
        if (Number(fromPrice) >= 0 && Number(toPrice) > 0) {
            filterQuery = Object.assign(Object.assign({}, filterQuery), { currentPrice: { $gte: Number(fromPrice), $lte: Number(toPrice) } });
        }
    }
    const result = yield Product_model_1.default.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: "$brand"
        },
        {
            $lookup: {
                from: "flavors",
                localField: "flavorId",
                foreignField: "_id",
                as: "flavor"
            }
        },
        {
            $unwind: "$flavor"
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                brandId: 1,
                flavorId: 1,
                category: "$category.name",
                brand: "$brand.name",
                flavor: "$flavor.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                image: "$image",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
        {
            $match: Object.assign(Object.assign(Object.assign({}, searchQuery), filterQuery), { status: "visible" })
        },
        {
            $project: {
                categoryId: 0,
                brandId: 0,
                flavorId: 0,
                status: 0,
            }
        },
        { $sort: { ratings: -1 } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Product_model_1.default.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $lookup: {
                from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: "$brand"
        },
        {
            $lookup: {
                from: "flavors",
                localField: "flavorId",
                foreignField: "_id",
                as: "flavor"
            }
        },
        {
            $unwind: "$flavor"
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            },
        },
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                brandId: 1,
                flavorId: 1,
                category: "$category.name",
                brand: "$brand.name",
                flavor: "$flavor.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                image: "$image",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
        {
            $match: Object.assign(Object.assign(Object.assign({}, searchQuery), filterQuery), { status: "visible" })
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
});
exports.default = GetUserProductsService;
