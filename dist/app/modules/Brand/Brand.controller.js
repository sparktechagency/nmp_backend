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
const Brand_service_1 = require("./Brand.service");
const createBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield (0, Brand_service_1.createBrandService)(name);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Brand is created successfully",
        data: result
    });
}));
const getBrands = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Brand_service_1.getBrandsService)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Brands are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getBrandDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Brand_service_1.getBrandDropDownService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Brands are retrieved successfully",
        data: result
    });
}));
const updateBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandId } = req.params;
    const { name } = req.body;
    const result = yield (0, Brand_service_1.updateBrandService)(brandId, name);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Brand is updated successfully",
        data: result
    });
}));
const deleteBrand = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brandId } = req.params;
    const result = yield (0, Brand_service_1.deleteBrandService)(brandId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Brand is deleted successfully",
        data: result
    });
}));
const BrandController = {
    createBrand,
    getBrands,
    getBrandDropDown,
    updateBrand,
    deleteBrand
};
exports.default = BrandController;
