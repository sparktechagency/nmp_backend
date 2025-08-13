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
exports.deleteFlavorService = exports.updateFlavorService = exports.getFlavorDropDownService = exports.getFlavorsService = exports.createFlavorService = void 0;
const slugify_1 = __importDefault(require("slugify"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Flavor_model_1 = __importDefault(require("./Flavor.model"));
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const Flavor_constant_1 = require("./Flavor.constant");
const Product_model_1 = __importDefault(require("../Product/Product.model"));
const createFlavorService = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, slugify_1.default)(name).toLowerCase();
    //check flavor is already existed
    const flavor = yield Flavor_model_1.default.findOne({
        slug
    });
    if (flavor) {
        throw new ApiError_1.default(409, 'This flavor is already existed');
    }
    const result = yield Flavor_model_1.default.create({
        name,
        slug
    });
    return result;
});
exports.createFlavorService = createFlavorService;
const getFlavorsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Flavor_constant_1.FlavorSearchableFields);
    }
    const result = yield Flavor_model_1.default.aggregate([
        {
            $match: Object.assign({}, searchQuery),
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                _id: 1,
                name: 1,
            },
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Flavor_model_1.default.aggregate([
        {
            $match: Object.assign({}, searchQuery)
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
exports.getFlavorsService = getFlavorsService;
const getFlavorDropDownService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Flavor_model_1.default.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
});
exports.getFlavorDropDownService = getFlavorDropDownService;
const updateFlavorService = (flavorId, name) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(flavorId)) {
        throw new ApiError_1.default(400, "flavorId must be a valid ObjectId");
    }
    const existingFlavor = yield Flavor_model_1.default.findById(flavorId);
    if (!existingFlavor) {
        throw new ApiError_1.default(404, 'This flavorId not found');
    }
    const slug = (0, slugify_1.default)(name).toLowerCase();
    const flavorExist = yield Flavor_model_1.default.findOne({
        _id: { $ne: flavorId },
        slug
    });
    if (flavorExist) {
        throw new ApiError_1.default(409, 'Sorry! This flavor is already existed');
    }
    const result = yield Flavor_model_1.default.updateOne({ _id: flavorId }, {
        name,
        slug
    });
    return result;
});
exports.updateFlavorService = updateFlavorService;
const deleteFlavorService = (flavorId) => __awaiter(void 0, void 0, void 0, function* () {
    const flavor = yield Flavor_model_1.default.findById(flavorId);
    if (!flavor) {
        throw new ApiError_1.default(404, 'This flavorId not found');
    }
    //check if flavorId is associated with Product
    const associateWithProduct = yield Product_model_1.default.findOne({
        flavorId
    });
    if (associateWithProduct) {
        throw new ApiError_1.default(409, 'Failed to delete, This flavor is associated with Product');
    }
    const result = yield Flavor_model_1.default.deleteOne({ _id: flavorId });
    return result;
});
exports.deleteFlavorService = deleteFlavorService;
