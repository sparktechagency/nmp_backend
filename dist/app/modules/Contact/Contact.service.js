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
exports.deleteContactService = exports.replyContactService = exports.getAllContactsService = exports.createContactService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Contact_constant_1 = require("./Contact.constant");
const Contact_model_1 = __importDefault(require("./Contact.model"));
const QueryBuilder_1 = require("../../helper/QueryBuilder");
const mongoose_1 = require("mongoose");
const sendReplyEmail_1 = __importDefault(require("../../utils/sendReplyEmail"));
const createContactService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Contact_model_1.default.create(payload);
    return result;
});
exports.createContactService = createContactService;
const getAllContactsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
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
        searchQuery = (0, QueryBuilder_1.makeSearchQuery)(searchTerm, Contact_constant_1.ContactSearchableFields);
    }
    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = (0, QueryBuilder_1.makeFilterQuery)(filters);
    }
    const result = yield Contact_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery),
        },
        {
            $project: {
                updatedAt: 0
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);
    // total count
    const totalCountResult = yield Contact_model_1.default.aggregate([
        {
            $match: Object.assign(Object.assign({}, searchQuery), filterQuery)
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
exports.getAllContactsService = getAllContactsService;
const replyContactService = (contactId, replyText) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(contactId)) {
        throw new ApiError_1.default(400, "contactId must be a valid ObjectId");
    }
    const contact = yield Contact_model_1.default.findById(contactId);
    if (!contact) {
        throw new ApiError_1.default(404, "contactId Not Found");
    }
    if (contact.replyText) {
        throw new ApiError_1.default(409, "Reply already sent.");
    }
    //update contact
    const result = yield Contact_model_1.default.updateOne({ _id: contactId }, { replyText, replyAt: new Date() });
    //send reply message
    yield (0, sendReplyEmail_1.default)(contact.email, replyText);
    return result;
});
exports.replyContactService = replyContactService;
const deleteContactService = (contactId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(contactId)) {
        throw new ApiError_1.default(400, "contactId must be a valid ObjectId");
    }
    const contact = yield Contact_model_1.default.findById(contactId);
    if (!contact) {
        throw new ApiError_1.default(404, "contactId Not Found");
    }
    const result = yield Contact_model_1.default.deleteOne({ _id: contactId });
    return result;
});
exports.deleteContactService = deleteContactService;
