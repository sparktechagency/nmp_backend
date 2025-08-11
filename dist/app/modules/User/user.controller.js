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
const user_constant_1 = require("./user.constant");
const user_service_1 = require("./user.service");
const getUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, user_constant_1.UserValidFields);
    const result = yield (0, user_service_1.getUsersService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Users are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const getSingleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, user_service_1.getSingleUserService)(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User is retrieved successfully",
        data: result
    });
}));
const getMeForSuperAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, user_service_1.getMeForSuperAdminService)(loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Information is retrieved successfully",
        data: result
    });
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, user_service_1.getMeService)(loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "My Profile is retrieved successfully",
        data: result
    });
}));
const editMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, user_service_1.editMyProfileService)(loginUserId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Profile is updated successfully",
        data: result
    });
}));
const updateProfileImg = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginUserId = req.headers.id;
    const result = yield (0, user_service_1.updateProfileImgService)(req, loginUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Image is updated successfully",
        data: result,
    });
}));
const getUserOverview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = req.params;
    const result = yield (0, user_service_1.getUserOverviewService)(year);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'User overview is retrieved successfully',
        data: result,
    });
}));
const UserController = {
    getUsers,
    getSingleUser,
    getMe,
    getMeForSuperAdmin,
    editMyProfile,
    updateProfileImg,
    getUserOverview,
};
exports.default = UserController;
