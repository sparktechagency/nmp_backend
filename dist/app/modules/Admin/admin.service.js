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
exports.deleteAdminService = exports.getAdminsService = exports.updateAdminService = exports.createAdminService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_model_1 = __importDefault(require("../User/user.model"));
const config_1 = __importDefault(require("../../config"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const admin_constant_1 = require("./admin.constant");
const mongoose_1 = require("mongoose");
const createAdminService = (req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.default.findOne({ email });
    if (user) {
        throw new ApiError_1.default(409, 'This Email is already existed');
    }
    if (!password) {
        payload.password = config_1.default.admin_default_password;
    }
    //create admin
    const result = yield user_model_1.default.create(Object.assign(Object.assign({}, payload), { role: "admin", isVerified: true, otp: "000000" }));
    const { _id, fullName, email: Email, phone, role } = result;
    return {
        _id,
        fullName,
        email: Email,
        phone,
        role
    };
});
exports.createAdminService = createAdminService;
const getAdminsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, admin_constant_1.AdminSearchFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield user_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({ role: "admin" }, searchQuery), filterQuery),
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
    const totalCount = yield user_model_1.default.countDocuments(Object.assign(Object.assign({ role: "admin" }, searchQuery), filterQuery));
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
exports.getAdminsService = getAdminsService;
const deleteAdminService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new ApiError_1.default(400, "adminId must be a valid ObjectId");
    }
    const adminUser = yield user_model_1.default.findById(userId);
    if (!adminUser) {
        throw new ApiError_1.default(404, "adminId Not Found");
    }
    const result = yield user_model_1.default.deleteOne({ _id: userId });
    return result;
});
exports.deleteAdminService = deleteAdminService;
const updateAdminService = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_model_1.default.findById(userId);
    if (!admin) {
        throw new ApiError_1.default(404, "Admin Not Found");
    }
    const result = user_model_1.default.updateOne({ _id: userId }, payload);
    return result;
});
exports.updateAdminService = updateAdminService;
