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
const mongoose_1 = require("mongoose");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const Product_model_1 = __importDefault(require("../Product.model"));
const slugify_1 = __importDefault(require("slugify"));
const Category_model_1 = __importDefault(require("../../Category/Category.model"));
const Brand_model_1 = __importDefault(require("../../Brand/Brand.model"));
const Flavor_model_1 = __importDefault(require("../../Flavor/Flavor.model"));
const UpdateProductService = (req, productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    //check product
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
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
    const { name, categoryId, brandId, flavorId } = payload;
    //check categoryId
    if (categoryId) {
        const category = yield Category_model_1.default.findById(categoryId);
        if (!category) {
            throw new ApiError_1.default(404, 'This categoryId not found');
        }
    }
    //check brandId
    if (brandId) {
        const brand = yield Brand_model_1.default.findById(brandId);
        if (!brand) {
            throw new ApiError_1.default(404, 'This brandId not found');
        }
    }
    //check flavorId
    if (flavorId) {
        const flavor = yield Flavor_model_1.default.findById(flavorId);
        if (!flavor) {
            throw new ApiError_1.default(404, 'This flavorId not found');
        }
    }
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
exports.default = UpdateProductService;
