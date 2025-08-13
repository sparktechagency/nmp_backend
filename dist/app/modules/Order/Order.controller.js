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
const pickValidFields_1 = __importDefault(require("../../utils/pickValidFields"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const Order_constant_1 = require("./Order.constant");
const Order_service_1 = require("./Order.service");
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const userEmail = req.headers.email;
    const result = yield (0, Order_service_1.createOrderService)(loginUserId, userEmail, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Order is created successfully',
        data: result,
    });
}));
const getSingleOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield (0, Order_service_1.getSingleOrderService)(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order is retrieved successfully',
        data: result,
    });
}));
const getUserOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const validatedQuery = (0, pickValidFields_1.default)(req.query, Order_constant_1.UserOrderValidFields);
    const result = yield (0, Order_service_1.getUserOrdersService)(loginUserId, validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Orders are retrieved successfully',
        meta: result.meta,
        data: result.data
    });
}));
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, Order_constant_1.OrderValidFields);
    const result = yield (0, Order_service_1.getAllOrdersService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Orders are retrieved successfully',
        meta: result.meta,
        data: result.data
    });
}));
const updateOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield (0, Order_service_1.updateOrderService)(orderId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order is updated successfully',
        data: result,
    });
}));
const deleteOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, Order_service_1.deleteOrderService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Order is deleted successfully',
        data: result,
    });
}));
const verifySession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.query;
    const result = yield (0, Order_service_1.verifySessionService)(sessionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Payment Successful',
        data: result,
    });
}));
const getIncomeOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.params;
    const result = yield (0, Order_service_1.getIncomeOverviewService)(year);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Income overview is retrieved successfully',
        data: result,
    });
}));
const OrderController = {
    createOrder,
    getSingleOrder,
    getUserOrders,
    getAllOrders,
    updateOrder,
    deleteOrder,
    verifySession,
    getIncomeOverview
};
exports.default = OrderController;
