"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Newsletter_validation_1 = require("./Newsletter.validation");
const Newsletter_controller_1 = __importDefault(require("./Newsletter.controller"));
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post('/subscribe', (0, validationMiddleware_1.default)(Newsletter_validation_1.newsletterValidationSchema), Newsletter_controller_1.default.subscribeToNewsletter);
router.get('/get-subscribers', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Newsletter_controller_1.default.getSubscribers);
router.delete('/delete-subscriber/:subscriberId', Newsletter_controller_1.default.deleteSubscriber);
const NewsletterRoutes = router;
exports.default = NewsletterRoutes;
