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
exports.deleteCartService = exports.updateCartService = exports.getCartsService = exports.createCartService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Cart_model_1 = __importDefault(require("./Cart.model"));
const Product_model_1 = __importDefault(require("../Product/Product.model"));
const mongoose_1 = require("mongoose");
const createCartService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = payload;
    //check product
    const product = yield Product_model_1.default.findById(productId);
    if (!product) {
        throw new ApiError_1.default(404, "productId not found");
    }
    //check product status
    if (product.status === "hidden") {
        throw new ApiError_1.default(404, "This product is hidden");
    }
    //check stock status
    if (product.stockStatus !== "in_stock") {
        throw new ApiError_1.default(404, `This product is ${product.stockStatus === "stock_out" ? "out of stock." : "upcoming"} `);
    }
    //check product has already been added to your cart
    const cart = yield Cart_model_1.default.findOne({
        userId: loginUserId,
        productId,
    });
    if (cart) {
        throw new ApiError_1.default(409, "This product has already been added to your cart");
    }
    const result = yield Cart_model_1.default.create(Object.assign(Object.assign({}, payload), { userId: loginUserId, name: product.name, price: product.currentPrice, image: product.image }));
    return result;
});
exports.createCartService = createCartService;
const getCartsService = (loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Cart_model_1.default.aggregate([
        {
            $match: {
                userId: new mongoose_1.Types.ObjectId(loginUserId)
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                price: 1,
                quantity: 1,
                image: 1
            },
        },
        { $sort: { createdAt: -1 } },
    ]);
    return (result === null || result === void 0 ? void 0 : result.length) > 0 ? result === null || result === void 0 ? void 0 : result.map((cv) => (Object.assign(Object.assign({}, cv), { total: Number(cv.price) * Number(cv.quantity) }))) : [];
});
exports.getCartsService = getCartsService;
const updateCartService = (loginUserId, cartId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(cartId)) {
        throw new ApiError_1.default(400, "cartId must be a valid ObjectId");
    }
    const cart = yield Cart_model_1.default.findOne({
        _id: cartId,
        userId: loginUserId
    });
    if (!cart) {
        throw new ApiError_1.default(404, "cartId not found");
    }
    const result = yield Cart_model_1.default.updateOne({ userId: loginUserId, _id: cartId }, payload);
    return result;
});
exports.updateCartService = updateCartService;
const deleteCartService = (loginUserId, cartId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(cartId)) {
        throw new ApiError_1.default(400, "cartId must be a valid ObjectId");
    }
    //check cartId
    const cart = yield Cart_model_1.default.findOne({
        _id: cartId,
        userId: loginUserId
    });
    if (!cart) {
        throw new ApiError_1.default(404, "cartId not found");
    }
    const result = yield Cart_model_1.default.deleteOne({ _id: cartId, userId: loginUserId });
    return result;
});
exports.deleteCartService = deleteCartService;
