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
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validationMiddleware = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const parsedData = yield schema.parseAsync(Object.assign(Object.assign({}, req.body), req.cookies));
            req.body = parsedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = {};
                error.issues.forEach((e) => {
                    if (e.path.length > 0) {
                        formattedErrors[e.path.join(".")] = e.message;
                    }
                });
                //first error message
                const firstErrorMessage = ((_a = error.issues[0]) === null || _a === void 0 ? void 0 : _a.message) || "Invalid input";
                return res.status(400).json({
                    success: false,
                    message: firstErrorMessage,
                    error: formattedErrors,
                });
            }
            next(error);
        }
    });
};
exports.default = validationMiddleware;
