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
const Newsletter_constant_1 = require("./Newsletter.constant");
const Newsletter_service_1 = require("./Newsletter.service");
const subscribeToNewsletter = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, Newsletter_service_1.subscribeToNewsletterService)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Subscribed success',
        data: result,
    });
}));
const getSubscribers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedQuery = (0, pickValidFields_1.default)(req.query, Newsletter_constant_1.NewsletterValidFields);
    const result = yield (0, Newsletter_service_1.getSubscribersService)(validatedQuery);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Subscribers are retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const deleteSubscriber = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriberId } = req.params;
    const result = yield (0, Newsletter_service_1.deleteSubsciberService)(subscriberId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Subscriber is deleted successfully',
        data: result,
    });
}));
const NewsletterController = {
    subscribeToNewsletter,
    getSubscribers,
    deleteSubscriber
};
exports.default = NewsletterController;
