"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Flavor_controller_1 = __importDefault(require("./Flavor.controller"));
const Flavor_validation_1 = require("./Flavor.validation");
const router = express_1.default.Router();
router.post("/create-flavor", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Flavor_validation_1.flavorValidationSchema), Flavor_controller_1.default.createFlavor);
router.get('/get-flavors', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Flavor_controller_1.default.getFlavors);
router.get("/get-flavor-drop-down", Flavor_controller_1.default.getFlavorDropDown);
router.patch("/update-flavor/:flavorId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), (0, validationMiddleware_1.default)(Flavor_validation_1.flavorValidationSchema), Flavor_controller_1.default.updateFlavor);
router.delete("/delete-flavor/:flavorId", (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Flavor_controller_1.default.deleteFlavor);
const FlavorRoutes = router;
exports.default = FlavorRoutes;
