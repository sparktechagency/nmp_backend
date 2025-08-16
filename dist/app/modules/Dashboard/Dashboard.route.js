"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const Dashboard_Controller_1 = __importDefault(require("./Dashboard.Controller"));
const router = express_1.default.Router();
router.get('/get-stats', (0, AuthMiddleware_1.default)("super_admin", "admin"), Dashboard_Controller_1.default.getStats);
router.get('/get-user-overview/:year', (0, AuthMiddleware_1.default)("super_admin", "admin"), Dashboard_Controller_1.default.getUserOverview);
router.get('/get-income-overview/:year', (0, AuthMiddleware_1.default)("super_admin", "admin"), Dashboard_Controller_1.default.getIncomeOverview);
const DashboardRoutes = router;
exports.default = DashboardRoutes;
