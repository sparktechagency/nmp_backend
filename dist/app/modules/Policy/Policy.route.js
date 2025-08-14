"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Policy_controller_1 = __importDefault(require("./Policy.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Policy_validation_1 = require("./Policy.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const router = express_1.default.Router();
router.patch('/create-update-policy', (0, AuthMiddleware_1.default)("super_admin", "admin"), (0, validationMiddleware_1.default)(Policy_validation_1.createPolicyValidationSchema), Policy_controller_1.default.createUpdatePolicy);
router.get('/get-policy-by-type/:type', Policy_controller_1.default.getPolicyByType);
const PolicyRoutes = router;
exports.default = PolicyRoutes;
