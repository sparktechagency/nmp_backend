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
exports.deleteBrandService = exports.updateBrandService = exports.getBrandDropDownService = exports.getBrandsService = exports.createBrandService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Brand_model_1 = __importDefault(require("./Brand.model"));
const mongoose_1 = require("mongoose");
// import ProductModel from "../Product/Product.model";
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const Brand_constant_1 = require("./Brand.constant");
const Brand_model_2 = __importDefault(require("./Brand.model"));
const createBrandService = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, slugify_1.default)(name).toLowerCase();
    //check category is already existed
    const category = yield Brand_model_2.default.findOne({
        slug
    });
    if (category) {
        throw new ApiError_1.default(409, 'This category is already existed');
    }
    const result = yield Brand_model_2.default.create({
        name,
        slug
    });
    return result;
});
exports.createBrandService = createBrandService;
const getBrandsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Brand_constant_1.BrandSearchableFields);
    }
    const result = yield Brand_model_2.default.aggregate([
        {
            $match: Object.assign({}, searchQuery),
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                _id: 1,
                name: 1,
            },
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Brand_model_2.default.aggregate([
        {
            $match: Object.assign({}, searchQuery)
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
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
exports.getBrandsService = getBrandsService;
const getBrandDropDownService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Brand_model_1.default.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
});
exports.getBrandDropDownService = getBrandDropDownService;
const updateBrandService = (brandId, name) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(brandId)) {
        throw new ApiError_1.default(400, "categoryId must be a valid ObjectId");
    }
    const existingCategory = yield Brand_model_2.default.findById(brandId);
    if (!existingCategory) {
        throw new ApiError_1.default(404, 'This brandId not found');
    }
    const slug = (0, slugify_1.default)(name).toLowerCase();
    const brandExist = yield Brand_model_2.default.findOne({
        _id: { $ne: brandId },
        slug
    });
    if (brandExist) {
        throw new ApiError_1.default(409, 'Sorry! This brand is already existed');
    }
    const result = yield Brand_model_2.default.updateOne({ _id: brandId }, {
        name,
        slug
    });
    return result;
});
exports.updateBrandService = updateBrandService;
const deleteBrandService = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Brand_model_1.default.findById(categoryId);
    if (!category) {
        throw new ApiError_1.default(404, 'This categoryId not found');
    }
    //check if categoryId is associated with Product
    // const associateWithProduct = await ProductModel.findOne({
    //      categoryId
    // });
    // if(associateWithProduct){
    //     throw new ApiError(409, 'Failled to delete, This category is associated with Product');
    // }
    const result = yield Brand_model_1.default.deleteOne({ _id: categoryId });
    return result;
});
exports.deleteBrandService = deleteBrandService;
