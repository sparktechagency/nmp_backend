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
exports.getIncomeOverviewService = exports.getUserOverviewService = exports.getStatsService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const isValidateYearFormat_1 = __importDefault(require("../../utils/isValidateYearFormat"));
const Order_model_1 = __importDefault(require("../Order/Order.model"));
const Product_model_1 = __importDefault(require("../Product/Product.model"));
const user_model_1 = __importDefault(require("../User/user.model"));
const getStatsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalUsers = yield user_model_1.default.countDocuments({
        role: "user"
    });
    const completedOrders = yield Order_model_1.default.countDocuments({
        status: "delivered",
        paymentStatus: "paid"
    });
    const totalIncomeResult = yield Order_model_1.default.aggregate([
        {
            $match: {
                status: "delivered",
                paymentStatus: "paid"
            }
        },
        {
            $group: {
                _id: 0,
                total: { $sum: "$totalPrice" },
            }
        }
    ]);
    const totalProducts = yield Product_model_1.default.countDocuments();
    return {
        totalUsers,
        completedOrders,
        totalIncome: (totalIncomeResult === null || totalIncomeResult === void 0 ? void 0 : totalIncomeResult.length) > 0 ? (_a = totalIncomeResult[0]) === null || _a === void 0 ? void 0 : _a.total : 0,
        totalProducts
    };
});
exports.getStatsService = getStatsService;
const getUserOverviewService = (year) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, isValidateYearFormat_1.default)(year)) {
        throw new ApiError_1.default(400, "Invalid year, year should be in 'YYYY' format.");
    }
    const start = `${year}-01-01T00:00:00.000+00:00`;
    const end = `${year}-12-31T00:00:00.000+00:00`;
    const result = yield user_model_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(start), $lte: new Date(end) },
                role: "user"
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                users: { $sum: 1 },
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
    //Fill in missing months
    const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const filledData = allMonths.map((month) => {
        const found = result === null || result === void 0 ? void 0 : result.find((item) => item.month === month);
        return {
            month,
            users: found ? found.users : 0
        };
    });
    return filledData;
});
exports.getUserOverviewService = getUserOverviewService;
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
