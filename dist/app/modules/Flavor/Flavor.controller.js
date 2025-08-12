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
const Flavor_service_1 = require("./Flavor.service");
const createFlavor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const result = yield (0, Flavor_service_1.createFlavorService)(name);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Flavor is created successfully",
        data: result
    });
}));
const getFlavors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Flavor_service_1.getFlavorsService)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Flavors are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getFlavorDropDown = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Flavor_service_1.getFlavorDropDownService)();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Flavors are retrieved successfully",
        data: result
    });
}));
const updateFlavor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { flavorId } = req.params;
    const { name } = req.body;
    const result = yield (0, Flavor_service_1.updateFlavorService)(flavorId, name);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Flavor is updated successfully",
        data: result
    });
}));
const deleteFlavor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { flavorId } = req.params;
    const result = yield (0, Flavor_service_1.deleteFlavorService)(flavorId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Flavor is deleted successfully",
        data: result
    });
}));
const FlavorController = {
    createFlavor,
    getFlavors,
    getFlavorDropDown,
    updateFlavor,
    deleteFlavor
};
exports.default = FlavorController;
