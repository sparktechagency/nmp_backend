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
const admin_constant_1 = require("./admin.constant");
const admin_service_1 = require("./admin.service");
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, admin_service_1.createAdminService)(req, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Admin is created successfully",
        data: result,
    });
}));
const updateAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield (0, admin_service_1.updateAdminService)(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin is updated successfully",
        data: result,
    });
}));
const getAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, admin_constant_1.AdminValidFields);
    const result = yield (0, admin_service_1.getAdminsService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admins are retrieved successfully",
        meta: result.meta,
        data: result.data
    });
}));
const deleteAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield (0, admin_service_1.deleteAdminService)(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Admin is deleted successfully",
        data: result,
    });
}));
const AdminController = {
    createAdmin,
    updateAdmin,
    getAdmins,
    deleteAdmin,
};
exports.default = AdminController;
