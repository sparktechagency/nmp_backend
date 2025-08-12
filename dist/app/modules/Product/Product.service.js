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
exports.deleteProductService = exports.updateProductImgService = exports.updateProductService = exports.getSingleProductService = exports.getProductsService = exports.getUserProductsService = exports.createProductService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Product_constant_1 = require("./Product.constant");
const Product_model_1 = __importDefault(require("./Product.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const slugify_1 = __importDefault(require("slugify"));
const Category_model_1 = __importDefault(require("../Category/Category.model"));
const mongoose_1 = __importStar(require("mongoose"));
const hasDuplicates_1 = __importDefault(require("../../utils/hasDuplicates"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const cloudinary_1 = __importDefault(require("../../helper/cloudinary"));
const Brand_model_1 = __importDefault(require("../Brand/Brand.model"));
const Flavor_model_1 = __importDefault(require("../Flavor/Flavor.model"));
const createProductService = (req, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    //destructuring the reqBody
    if (!reqBody) {
        throw new ApiError_1.default(400, "name is required!");
    }
    const file = req.file;
    if (!file) {
        throw new ApiError_1.default(400, "Upload image");
    }
    const { name, categoryId, brandId, flavorId, description, currentPrice, originalPrice, discount, status, stockStatus } = reqBody;
    let payload = {};
    if (!name) {
        throw new ApiError_1.default(400, "name is required!");
    }
    if (!categoryId) {
        throw new ApiError_1.default(400, "categoryId is required!");
    }
    if (!mongoose_1.Types.ObjectId.isValid(categoryId)) {
        throw new ApiError_1.default(400, "categoryId must be a valid ObjectId");
    }
    if (!brandId) {
        throw new ApiError_1.default(400, "brandId is required!");
    }
    if (!mongoose_1.Types.ObjectId.isValid(brandId)) {
        throw new ApiError_1.default(400, "brandId must be a valid ObjectId");
    }
    if (!flavorId) {
        throw new ApiError_1.default(400, "flavorId is required!");
    }
    if (!mongoose_1.Types.ObjectId.isValid(flavorId)) {
        throw new ApiError_1.default(400, "flavorId must be a valid ObjectId");
    }
    if (!description) {
        throw new ApiError_1.default(400, "description is required!");
    }
    //check current price
    if (!currentPrice) {
        throw new ApiError_1.default(400, "currentPrice is required!");
    }
    if (typeof Number(currentPrice) !== "number" || isNaN(Number(currentPrice))) {
        throw new ApiError_1.default(400, "current price must be a valid number");
    }
    // Step 4: Must be greater than 0
    if (Number(currentPrice) <= 0) {
        throw new ApiError_1.default(400, "Current price must be greater than 0");
    }
    //set required fields
    payload = {
        name,
        categoryId,
        brandId,
        flavorId,
        description,
        currentPrice: Number(currentPrice),
    };
    //check original price
    if (originalPrice) {
        if (typeof Number(originalPrice) !== "number" || isNaN(Number(originalPrice))) {
            throw new ApiError_1.default(400, "original price must be a valid number");
        }
        // Step 4: Must be greater than 0
        if (Number(originalPrice) <= 0) {
            throw new ApiError_1.default(400, "original price must be greater than 0");
        }
        payload.originalPrice = Number(originalPrice);
    }
    //check discount
    if (discount) {
        payload.discount = discount;
    }
    //check status
    if (status) {
        if (!['visible', 'hidden'].includes(status)) {
            throw new ApiError_1.default(400, "status must be one of: 'visible', 'hidden'");
        }
        payload.status = status;
    }
    //check stock status
    if (stockStatus) {
        if (!['in_stock', 'stock_out', 'up_coming'].includes(stockStatus)) {
            throw new ApiError_1.default(400, "Stock Status must be one of: in_stock', 'stock_out', 'up_coming'");
        }
        payload.stockStatus = stockStatus;
    }
    //make slug
    const slug = (0, slugify_1.default)(name).toLowerCase();
    payload.slug = slug;
    //check product name is already existed
    const product = yield Product_model_1.default.findOne({
        slug
    });
    if (product) {
        throw new ApiError_1.default(409, "This name is already taken.");
    }
    //check categoryId
    const existingCategory = yield Category_model_1.default.findById(categoryId);
    if (!existingCategory) {
        throw new ApiError_1.default(404, 'This categoryId not found');
    }
    //check brandId
    const existingBrand = yield Brand_model_1.default.findById(brandId);
    if (!existingBrand) {
        throw new ApiError_1.default(404, 'This brandId not found');
    }
    //check flavorId
    const existingFlavor = yield Flavor_model_1.default.findById(flavorId);
    if (!existingFlavor) {
        throw new ApiError_1.default(404, 'This flavorId not found');
    }
    //upload a image
    if (req.file && req.file) {
        const file = req.file;
        const cloudinaryRes = yield cloudinary_1.default.uploader.upload(file.path, {
            folder: 'NMP-Ecommerce',
            // width: 300,
            // crop: 'scale',
        });
        payload.image = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
        // fs.unlink(file.path);
    }
    const result = yield Product_model_1.default.create(Object.assign({}, payload));
    return result;
});
exports.createProductService = createProductService;
const getUserProductsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
                images: "$images",
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
                images: "$images",
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
exports.getUserProductsService = getUserProductsService;
const getProductsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
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
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                createdAt: "$createdAt",
                totalReview: "$totalReview",
                images: "$images",
                status: "$status",
                stockStatus: "$stockStatus",
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $sort: { [sortBy]: sortDirection } },
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
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                colors: "$colors",
                sizes: "$sizes",
                introduction: "$introduction",
                description: "$description",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
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
exports.getProductsService = getProductsService;
const getSingleProductService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    const product = yield Product_model_1.default.aggregate([
        {
            $match: { _id: new ObjectId_1.default(productId) }
        },
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
                from: "colors",
                localField: "colors",
                foreignField: "_id",
                as: "colors"
            }
        },
        {
            $lookup: {
                from: "sizes",
                localField: "sizes",
                foreignField: "_id",
                as: "sizes"
            }
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
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                colors: {
                    $map: {
                        input: "$colors",
                        as: "color",
                        in: {
                            _id: "$$color._id",
                            name: "$$color.name",
                            hexCode: "$$color.hexCode"
                        }
                    }
                },
                sizes: {
                    $map: {
                        input: "$sizes",
                        as: "size",
                        in: {
                            _id: "$$size._id",
                            size: "$$size.size",
                        }
                    }
                },
                introduction: "$introduction",
                description: "$description",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
    ]);
    if (product.length === 0) {
        throw new ApiError_1.default(404, 'Product Not Found');
    }
    const categoryId = (_a = product[0]) === null || _a === void 0 ? void 0 : _a.categoryId;
    //find related products
    const relatedProducts = yield Product_model_1.default.aggregate([
        {
            $match: {
                _id: { $ne: new mongoose_1.Types.ObjectId(productId) },
                categoryId: categoryId,
                status: "visible"
            }
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
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                categoryName: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                images: "$images",
                status: "$status"
            },
        },
    ]);
    return {
        product: product[0],
        relatedProducts
    };
});
exports.getSingleProductService = getSingleProductService;
const updateProductService = (req, productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    //check product
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    if (Number(payload.originalPrice) > 0) {
        console.log("log", payload.originalPrice);
    }
    if ((Number(payload.originalPrice) > 0) && !payload.currentPrice) {
        if (product.currentPrice > Number(payload.originalPrice)) {
            throw new ApiError_1.default(400, "Original price must be more than current price1");
        }
    }
    if (!payload.originalPrice && payload.currentPrice && Number(product === null || product === void 0 ? void 0 : product.originalPrice) > 0) {
        if (payload.currentPrice > Number(product === null || product === void 0 ? void 0 : product.originalPrice)) {
            throw new ApiError_1.default(400, "Current price must be less than original price");
        }
    }
    if (payload.currentPrice && Number(payload.originalPrice) > 0) {
        if (payload.currentPrice > Number(payload.originalPrice)) {
            throw new ApiError_1.default(400, "Original price must be more than current price2");
        }
    }
    //desctructuring the payload
    const { name } = payload;
    //check product name is already existed
    if (name) {
        const slug = (0, slugify_1.default)(name).toLowerCase();
        payload.slug = slug;
        const existingProductName = yield Product_model_1.default.findOne({
            _id: { $ne: productId },
            slug
        });
        if (existingProductName) {
            throw new ApiError_1.default(409, 'This Product name is already existed');
        }
    }
    //update the product
    const result = yield Product_model_1.default.updateOne({ _id: productId }, payload, { runValidators: true });
    return result;
});
exports.updateProductService = updateProductService;
const updateProductImgService = (req, productId) => __awaiter(void 0, void 0, void 0, function* () {
    let images = [];
    if (req.files && req.files.length > 0) {
        const files = req.files;
        // for (const file of files) {
        //   const path = `${req.protocol}://${req.get("host")}/uploads/${file?.filename}`;  //for local machine
        //   images.push(path)
        // }
        images = yield Promise.all(files === null || files === void 0 ? void 0 : files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield cloudinary_1.default.uploader.upload(file.path, {
                folder: 'MTK-Ecommerce',
                // width: 300,
                // crop: 'scale',
            });
            // Delete local file (non-blocking)
            // fs.unlink(file.path);
            return result.secure_url;
        })));
    }
    else {
        throw new ApiError_1.default(400, "Minimum one image required");
    }
    const result = yield Product_model_1.default.updateOne({ _id: productId }, { images }, { runValidators: true });
    return result;
});
exports.updateProductImgService = updateProductImgService;
const deleteProductService = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    //check product is associated with order
    // const associateWithOrder = await OrderModel.findOne({
    //   'products.productId': productId
    // });
    // if(associateWithOrder) {
    //   throw new ApiError(409, 'Failled to delete, This product is associated with Order');
    // }
    //transaction & rollback
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete favourite list
        // await FavouriteModel.deleteMany(
        //   { productId: new ObjectId(productId) },
        //   { session }
        // );
        // //delete from cart list
        // await CartModel.deleteMany(
        //   { productId: new ObjectId(productId) },
        //   { session }
        // );
        //delete the reviews
        // await ReviewModel.deleteMany(
        //   { restaurantId: new ObjectId(restaurant._id) },
        //   { session }
        // );
        //delete product
        const result = yield Product_model_1.default.deleteOne({ _id: new ObjectId_1.default(productId) }, { session });
        //transaction success
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
exports.deleteProductService = deleteProductService;
