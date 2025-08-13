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
const Cart_service_1 = require("./Cart.service");
const createCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, Cart_service_1.createCartService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Product is added to cart',
        data: result,
    });
}));
const getCarts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, Cart_service_1.getCartsService)(loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Carts are retrieved successfully',
        data: result
    });
}));
const updateCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { cartId } = req.params;
    const result = yield (0, Cart_service_1.updateCartService)(loginUserId, cartId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cart is updated successfully',
        data: result,
    });
}));
const deleteCart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const { cartId } = req.params;
    const result = yield (0, Cart_service_1.deleteCartService)(loginUserId, cartId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Cart is deleted successfully',
        data: result,
    });
}));
const CartController = {
    createCart,
    getCarts,
    updateCart,
    deleteCart,
};
exports.default = CartController;
