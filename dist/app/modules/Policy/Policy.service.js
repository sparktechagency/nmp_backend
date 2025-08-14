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
exports.getPolicyByTypeService = exports.createUpdatePolicyService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const Policy_constant_1 = require("./Policy.constant");
const Policy_model_1 = __importDefault(require("./Policy.model"));
const createUpdatePolicyService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check policy is already exists
    const policy = yield Policy_model_1.default.findOne({ type: payload.type });
    if (policy) {
        const result = yield Policy_model_1.default.updateOne({ type: payload.type }, { content: payload.content }, { runValidators: true });
        return result;
    }
    const result = yield Policy_model_1.default.create(payload);
    return result;
});
exports.createUpdatePolicyService = createUpdatePolicyService;
const getPolicyByTypeService = (type) => __awaiter(void 0, void 0, void 0, function* () {
    //check type is not valid
    if (!Policy_constant_1.PolicyTypeArray.includes(type)) {
        throw new ApiError_1.default(400, `Please provide valid Type-- 'privacy-policy' or 'terms-condition' or 'about-us', 'help' `);
    }
    const result = yield Policy_model_1.default.findOne({ type }).select("-_id -createdAt -updatedAt");
    if (!result) {
        return {
            type,
            content: ""
        };
    }
    return result;
});
exports.getPolicyByTypeService = getPolicyByTypeService;
