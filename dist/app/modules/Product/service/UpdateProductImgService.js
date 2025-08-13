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
const cloudinary_1 = __importDefault(require("../../../helper/cloudinary"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const Product_model_1 = __importDefault(require("../Product.model"));
const mongoose_1 = require("mongoose");
const UpdateProductImgService = (req, productId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(productId)) {
        throw new ApiError_1.default(400, "productId must be a valid ObjectId");
    }
    //check product
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "Product Not Found");
    }
    const file = req.file;
    if (!file) {
        throw new ApiError_1.default(400, "Upload image");
    }
    //upload a image
    let image = "";
    if (req.file && req.file) {
        const file = req.file;
        const cloudinaryRes = yield cloudinary_1.default.uploader.upload(file.path, {
            folder: 'NMP-Ecommerce',
            // width: 300,
            // crop: 'scale',
        });
        image = cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url;
        // fs.unlink(file.path);
    }
    if (!image) {
        throw new ApiError_1.default(400, "upload a image");
    }
    const result = yield Product_model_1.default.updateOne({ _id: productId }, { image }, { runValidators: true });
    return result;
});
exports.default = UpdateProductImgService;
