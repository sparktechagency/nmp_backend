"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Category_controller_1 = __importDefault(require("./Category.controller"));
const Category_validation_1 = require("./Category.validation");
const router = express_1.default.Router();
router.post("/create-category", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Category_validation_1.categoryValidationSchema), Category_controller_1.default.createCategory);
router.get('/get-categories', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Category_controller_1.default.getCategories);
router.get("/get-category-drop-down", Category_controller_1.default.getCategoryDropDown);
router.patch("/update-category/:categoryId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Category_validation_1.categoryValidationSchema), Category_controller_1.default.updateCategory);
router.delete("/delete-category/:categoryId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Category_controller_1.default.deleteCategory);
const CategoryRoutes = router;
exports.default = CategoryRoutes;
