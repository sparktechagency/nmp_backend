"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Brand_controller_1 = __importDefault(require("./Brand.controller"));
const Brand_validation_1 = require("./Brand.validation");
const router = express_1.default.Router();
router.post("/create-brand", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Brand_validation_1.brandValidationSchema), Brand_controller_1.default.createBrand);
router.get('/get-brands', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Brand_controller_1.default.getBrands);
router.get("/get-brand-drop-down", Brand_controller_1.default.getBrandDropDown);
router.patch("/update-brand/:brandId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Brand_validation_1.brandValidationSchema), Brand_controller_1.default.updateBrand);
router.delete("/delete-brand/:brandId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Brand_controller_1.default.deleteBrand);
const BrandRoutes = router;
exports.default = BrandRoutes;
