"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomeOverviewService = exports.verifySessionService = exports.deleteOrderService = exports.updateOrderService = exports.getSingleOrderService = exports.getAllOrdersService = exports.getUserOrdersService = exports.createOrderService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Order_constant_1 = require("./Order.constant");
const Order_model_1 = __importDefault(require("./Order.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const Cart_model_1 = __importDefault(require("../Cart/Cart.model"));
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const mongoose_1 = __importStar(require("mongoose"));
const generateTransactionId_1 = __importDefault(require("../../utils/generateTransactionId"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config"));
const isValidateYearFormat_1 = __importDefault(require("../../utils/isValidateYearFormat"));
const stripe = new stripe_1.default(config_1.default.stripe_secret_key);
const createOrderService = (loginUserId, userEmail, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const carts = yield Cart_model_1.default.aggregate([
        {
            $match: {
                userId: new ObjectId_1.default(loginUserId)
            }
        },
        {
            $project: {
                _id: 0,
                userId: 0,
                createdAt: 0,
                updatedAt: 0
            }
        }
    ]);
    if ((carts === null || carts === void 0 ? void 0 : carts.length) === 0) {
        throw new ApiError_1.default(404, "No items in cart.");
    }
    //count totalPrice
    const totalPrice = carts === null || carts === void 0 ? void 0 : carts.reduce((total, currentValue) => total + (currentValue.price * currentValue.quantity), 0);
    const cartProducts = carts === null || carts === void 0 ? void 0 : carts.map((cv) => (Object.assign(Object.assign({}, cv), { total: Number(cv.price) * Number(cv.quantity) })));
    const lineItems = cartProducts === null || cartProducts === void 0 ? void 0 : cartProducts.map((product) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: product.name,
            },
            unit_amount: product.price * 100, // price in cents
        },
        quantity: product.quantity,
    }));
    //generate token
    const token = Math.floor(100000 + Math.random() * 900000);
    //generate transactionId
    const transactionId = (0, generateTransactionId_1.default)();
    //transaction & rollback
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete from cart list
        yield Cart_model_1.default.deleteMany({ userId: new ObjectId_1.default(loginUserId) }, { session });
        const order = yield Order_model_1.default.create([
            {
                userId: loginUserId,
                token,
                products: cartProducts,
                totalPrice,
                transactionId,
                shipping: payload
            }
        ], { session });
        //create payment session
        const paymentSession = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            metadata: {
                orderId: (order[0]._id).toString(),
                userId: loginUserId
            },
            customer_email: userEmail,
            client_reference_id: (order[0]._id).toString(),
            success_url: `${config_1.default.frontend_url}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config_1.default.frontend_url}/cancel`,
        });
        //transaction success
        yield session.commitTransaction();
        yield session.endSession();
        return {
            url: paymentSession.url
        };
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.createOrderService = createOrderService;
const getUserOrdersService = (loginUserId, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const result = yield Order_model_1.default.aggregate([
        {
            $match: {
                userId: new ObjectId_1.default(loginUserId)
            }
        },
        { $skip: skip },
        { $limit: Number(limit) },
        { $unwind: "$products" },
        {
            $lookup: {
                from: "reviews",
                let: {
                    productId: "$products.productId",
                    orderId: "$_id",
                    userId: new ObjectId_1.default(loginUserId),
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$productId", "$$productId"] },
                                    { $eq: ["$orderId", "$$orderId"] },
                                    { $eq: ["$userId", "$$userId"] },
                                ],
                            },
                        },
                    },
                ],
                as: "products.reviews",
            },
        },
        {
            $addFields: {
                "products.isReview": {
                    $cond: {
                        if: { $gt: [{ $size: "$products.reviews" }, 0] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $group: {
                _id: "$_id",
                token: { $first: "$token" },
                userId: { $first: "$userId" },
                totalPrice: { $first: "$totalPrice" },
                paymentStatus: { $first: "$paymentStatus" },
                status: { $first: "$status" },
                deliveryAt: { $first: "$deliveryAt" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                products: { $push: "$products" }
            }
        },
        {
            $project: {
                _id: 1,
                token: 1,
                totalPrice: 1,
                paymentStatus: 1,
                status: 1,
                deliveryAt: 1,
                createdAt: 1,
                products: {
                    $map: {
                        input: "$products",
                        as: "product",
                        in: {
                            productId: "$$product.productId",
                            name: "$$product.name",
                            price: "$$product.price",
                            quantity: "$$product.quantity",
                            total: "$$product.total",
                            image: "$$product.image",
                            isReview: "$$product.isReview"
                        }
                    }
                }
            }
        },
        { $sort: { [sortBy]: sortDirection } },
    ]);
    // total count
    const totalCountResult = yield Order_model_1.default.aggregate([
        {
            $match: {
                userId: new ObjectId_1.default(loginUserId)
            }
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
});
exports.getUserOrdersService = getUserOrdersService;
const getAllOrdersService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Order_constant_1.OrderSearchableFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield Order_model_1.default.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                token: 1,
                totalPrice: 1,
                fullName: "$user.fullName",
                email: "$user.email",
                phone: "$user.phone",
                status: "$status",
                paymentStatus: "$paymentStatus",
                deliveryAt: "$deliveryAt",
                createdAt: "$createdAt"
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count result
    const totalCountResult = yield Order_model_1.default.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                token: 1,
                fullName: "$user.fullName",
                email: "$user.email",
                phone: "$user.phone",
                status: "$status",
                paymentStatus: "$paymentStatus",
                deliveryAt: "$deliveryAt",
                createdAt: "$createdAt"
            },
        },
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        { $count: "totalCount" }
    ]);
    const totalCount = ((_a = totalCountResult[0]) === null || _a === void 0 ? void 0 : _a.totalCount) || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));
    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: result,
    };
});
exports.getAllOrdersService = getAllOrdersService;
const getSingleOrderService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
        throw new ApiError_1.default(400, "orderId must be a valid ObjectId");
    }
    const result = yield Order_model_1.default.aggregate([
        {
            $match: {
                _id: new ObjectId_1.default(orderId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 1,
                token: 1,
                customerName: "$user.fullName",
                customerEmail: "$user.email",
                customerPhone: "$user.phone",
                shipping: 1,
                totalPrice: 1,
                paymentStatus: 1,
                status: 1,
                deliveryAt: 1,
                products: 1,
                createdAt: "$createdAt",
            }
        },
    ]);
    if (result.length === 0) {
        throw new ApiError_1.default(404, 'orderId Not Found');
    }
    return result[0];
});
exports.getSingleOrderService = getSingleOrderService;
const updateOrderService = (orderId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(orderId)) {
        throw new ApiError_1.default(400, "orderId must be a valid ObjectId");
    }
    const order = yield Order_model_1.default.findById(orderId);
    if (!order) {
        throw new ApiError_1.default(404, "orderId not found");
    }
    //if status==="delivered"
    if (payload.status === "delivered") {
        if (order.paymentStatus !== "paid") {
            throw new ApiError_1.default(403, "This order has not been paid for yet.");
        }
        payload.deliveryAt = new Date();
    }
    const result = yield Order_model_1.default.updateOne({ _id: orderId }, payload);
    return result;
});
exports.updateOrderService = updateOrderService;
const deleteOrderService = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_model_1.default.findById(orderId);
    if (!order) {
        throw new ApiError_1.default(404, "Order Not Found");
    }
    const result = yield Order_model_1.default.deleteOne({ _id: orderId });
    return result;
});
exports.deleteOrderService = deleteOrderService;
const verifySessionService = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!sessionId) {
        throw new ApiError_1.default(400, "sessionId is required");
    }
    try {
        const session = yield stripe.checkout.sessions.retrieve(sessionId);
        //payment_status = "no_payment_required", "paid", "unpaid"
        if (session.payment_status !== "paid") {
            throw new ApiError_1.default(403, "Payment Failled");
        }
        const metadata = session === null || session === void 0 ? void 0 : session.metadata;
        if (!metadata) {
            throw new ApiError_1.default(400, "Invalid Session Id");
        }
        //update database base on metadata = session.metadata
        const result = yield Order_model_1.default.updateOne({
            _id: metadata.orderId,
            userId: metadata.userId
        }, {
            paymentStatus: "paid"
        });
        return result;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.verifySessionService = verifySessionService;
const getIncomeOverviewService = (year) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, isValidateYearFormat_1.default)(year)) {
        throw new ApiError_1.default(400, "Invalid year, year should be in 'YYYY' format.");
    }
    const start = `${year}-01-01T00:00:00.000+00:00`;
    const end = `${year}-12-31T00:00:00.000+00:00`;
    const result = yield Order_model_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(start), $lte: new Date(end) },
                paymentStatus: "paid"
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                income: { $sum: "$totalPrice" },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
        {
            $addFields: {
                month: {
                    $arrayElemAt: [
                        [
                            "",
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                        ],
                        "$_id.month",
                    ],
                },
            },
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);
    // Fill in missing months
    const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const filledData = allMonths.map((month) => {
        const found = result === null || result === void 0 ? void 0 : result.find((item) => item.month === month);
        return {
            month,
            income: found ? found.income : 0
        };
    });
    return filledData;
});
exports.getIncomeOverviewService = getIncomeOverviewService;
