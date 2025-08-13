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
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const Product_model_1 = __importDefault(require("../Product.model"));
const Category_model_1 = __importDefault(require("../../Category/Category.model"));
const Brand_model_1 = __importDefault(require("../../Brand/Brand.model"));
const Flavor_model_1 = __importDefault(require("../../Flavor/Flavor.model"));
const cloudinary_1 = __importDefault(require("../../../helper/cloudinary"));
const CreateProductService = (req, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = CreateProductService;
