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
const Category_service_1 = require("./Category.service");
const createCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield (0, Category_service_1.createCategoryService)(name);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Category is created successfully",
        data: result
    });
}));
const getCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Category_service_1.getCategoriesService)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Categories are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getCategoryDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Category_service_1.getCategoryDropDownService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Categories are retrieved successfully",
        data: result
    });
}));
const updateCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const { name } = req.body;
    const result = yield (0, Category_service_1.updateCategoryService)(categoryId, name);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category is updated successfully",
        data: result
    });
}));
const deleteCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    const result = yield (0, Category_service_1.deleteCategoryService)(categoryId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Category is deleted successfully",
        data: result
    });
}));
const CategoryController = {
    createCategory,
    getCategories,
    getCategoryDropDown,
    updateCategory,
    deleteCategory
};
exports.default = CategoryController;
