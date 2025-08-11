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
exports.getUserOverviewService = exports.updateProfileImgService = exports.editMyProfileService = exports.getMeService = exports.getMeForSuperAdminService = exports.getSingleUserService = exports.getUsersService = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const user_constant_1 = require("./user.constant");
const ObjectId_1 = __importDefault(require("../../utils/ObjectId"));
const isValidateYearFormat_1 = __importDefault(require("../../utils/isValidateYearFormat"));
const ApiError_2 = __importDefault(require("../../errors/ApiError"));
const getUsersService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Extract query parameters
    const { searchTerm, page = 1, limit = 10, sortOrder = "desc", sortBy = "createdAt" } = query, filters = __rest(query, ["searchTerm", "page", "limit", "sortOrder", "sortBy"]) // Any additional filters
    ;
    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);
    //3. setup sorting
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    //4. setup searching
    let searchQuery = {};
    if (searchTerm) {
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, user_constant_1.UserSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield user_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({ role: "user" }, searchQuery), filterQuery),
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                phone: 1,
                gender: 1,
                status: 1
            },
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count of matching users
    const totalCount = yield user_model_1.default.countDocuments(Object.assign(Object.assign({ role: "user" }, searchQuery), filterQuery));
    return {
        meta: {
            page: Number(page), //currentPage
            limit: Number(limit),
            totalPages: Math.ceil(totalCount / Number(limit)),
            total: totalCount,
        },
        data: result,
    };
});
exports.getUsersService = getUsersService;
const getSingleUserService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId).select('-role -status -address');
    if (!user) {
        throw new ApiError_1.default(404, "No User Found");
    }
    return user;
});
exports.getSingleUserService = getSingleUserService;
const getMeForSuperAdminService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const result = yield user_model_1.default.aggregate([
        {
            $match: {
                _id: new ObjectId_1.default(userId)
            }
        },
        {
            $lookup: {
                from: "administrators",
                localField: "_id",
                foreignField: "userId",
                as: "administrator"
            }
        },
    ]);
    const returnData = {
        fullName: (_a = result[0]) === null || _a === void 0 ? void 0 : _a.fullName,
        email: (_b = result[0]) === null || _b === void 0 ? void 0 : _b.email,
        phone: (_c = result[0]) === null || _c === void 0 ? void 0 : _c.phone,
        role: (_d = result[0]) === null || _d === void 0 ? void 0 : _d.role,
        profileImg: (_e = result[0]) === null || _e === void 0 ? void 0 : _e.profileImg,
        access: ((_g = (_f = result[0]) === null || _f === void 0 ? void 0 : _f.administrator) === null || _g === void 0 ? void 0 : _g.length) > 0 ? (_j = (_h = result[0]) === null || _h === void 0 ? void 0 : _h.administrator[0]) === null || _j === void 0 ? void 0 : _j.access : ["user", "owner", "restaurant", "settings"]
    };
    return returnData;
});
exports.getMeForSuperAdminService = getMeForSuperAdminService;
const getMeService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId).select("fullName email phone");
    if (!user) {
        throw new ApiError_1.default(404, "No User Found");
    }
    return user;
});
exports.getMeService = getMeService;
const editMyProfileService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = user_model_1.default.updateOne({ _id: loginUserId }, payload, { runValidators: true });
    return result;
});
exports.editMyProfileService = editMyProfileService;
const updateProfileImgService = (req, loginUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new ApiError_1.default(400, "image is required");
    }
    //uploaded-image
    //const image = await uploadImage(req);
    const result = yield user_model_1.default.updateOne({ _id: loginUserId }, { profileImg: "image" });
    return result;
});
exports.updateProfileImgService = updateProfileImgService;
const getUserOverviewService = (year) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, isValidateYearFormat_1.default)(year)) {
        throw new ApiError_2.default(400, "Invalid year, year should be in 'YYYY' format.");
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
