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
const Dashboard_service_1 = require("./Dashboard.service");
const getStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Dashboard_service_1.getStatsService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Stats retrieved successfully',
        data: result,
    });
}));
const getUserOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.params;
    const result = yield (0, Dashboard_service_1.getUserOverviewService)(year);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User overview is retrieved successfully',
        data: result,
    });
}));
const getIncomeOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.params;
    const result = yield (0, Dashboard_service_1.getIncomeOverviewService)(year);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Income overview is retrieved successfully',
        data: result,
    });
}));
const DashboardController = {
    getStats,
    getUserOverview,
    getIncomeOverview
};
exports.default = DashboardController;
