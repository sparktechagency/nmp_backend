"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Information_validation_1 = require("./Information.validation");
const user_constant_1 = require("../User/user.constant");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const Information_controller_1 = __importDefault(require("./Information.controller"));
const router = express_1.default.Router();
router.patch('/create-update-information', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Information_validation_1.createInformationValidationSchema), Information_controller_1.default.createInformation);
router.get('/get-information', Information_controller_1.default.getInformation);
const InformationRoutes = router;
exports.default = InformationRoutes;
