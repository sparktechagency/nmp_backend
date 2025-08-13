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
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const Product_constant_1 = require("./Product.constant");
const CreateProductService_1 = __importDefault(require("./service/CreateProductService"));
const GetSingleProductService_1 = __importDefault(require("./service/GetSingleProductService"));
const GetUserProductsService_1 = __importDefault(require("./service/GetUserProductsService"));
const GetProductsService_1 = __importDefault(require("./service/GetProductsService"));
const GetProductService_1 = __importDefault(require("./service/GetProductService"));
const UpdateProductService_1 = __importDefault(require("./service/UpdateProductService"));
const UpdateProductImgService_1 = __importDefault(require("./service/UpdateProductImgService"));
const DeleteProductService_1 = __importDefault(require("./service/DeleteProductService"));
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, CreateProductService_1.default)(req, req.body);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Product is created successfully',
        data: result,
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield (0, GetSingleProductService_1.default)(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Product is retrieved successfully',
        data: result,
    });
}));
const getProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield (0, GetProductService_1.default)(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Product is retrieved successfully',
        data: result,
    });
}));
const getUserProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, Product_constant_1.UserProductValidFields);
    const result = yield (0, GetUserProductsService_1.default)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Products are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, Product_constant_1.ProductValidFields);
    const result = yield (0, GetProductsService_1.default)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Products are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield (0, UpdateProductService_1.default)(req, productId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Product is updated successfully',
        data: result,
    });
}));
const updateProductImg = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield (0, UpdateProductImgService_1.default)(req, productId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: `Product's image is updated successfully`,
        data: result,
    });
}));
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const result = yield (0, DeleteProductService_1.default)(productId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Product is deleted successfully',
        data: result,
    });
}));
const ProductController = {
    createProduct,
    getSingleProduct,
    getProduct,
    getUserProducts,
    getProducts,
    updateProduct,
    updateProductImg,
    deleteProduct,
};
exports.default = ProductController;
