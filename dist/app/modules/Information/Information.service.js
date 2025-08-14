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
exports.getInformationService = exports.createInformationService = void 0;
const Information_model_1 = __importDefault(require("./Information.model"));
const createInformationService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check information
    const information = yield Information_model_1.default.findOne();
    if (information) {
        const result = yield Information_model_1.default.updateOne({}, payload, { runValidators: true });
        return result;
    }
    const result = yield Information_model_1.default.create(payload);
    return result;
});
exports.createInformationService = createInformationService;
const getInformationService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Information_model_1.default.findOne().select("-createdAt -updatedAt -_id");
    if (!result) {
        return {
            "email": "",
            "phone": "",
            "address": "",
            "instagram": "",
            "telegram": ""
        };
    }
    return result;
});
exports.getInformationService = getInformationService;
