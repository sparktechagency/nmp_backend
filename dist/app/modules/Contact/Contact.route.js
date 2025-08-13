"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Contact_controller_1 = __importDefault(require("./Contact.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Contact_validation_1 = require("./Contact.validation");
const user_constant_1 = require("../User/user.constant");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const router = express_1.default.Router();
router.post('/create-contact', (0, validationMiddleware_1.default)(Contact_validation_1.createContactValidationSchema), Contact_controller_1.default.createContact);
router.patch('/reply/:contactId', (0, AuthMiddleware_1.default)('admin', 'super_admin'), (0, validationMiddleware_1.default)(Contact_validation_1.replyContactValidationSchema), Contact_controller_1.default.replyContact);
router.delete('/delete-contact/:contactId', Contact_controller_1.default.deleteContact);
router.get('/get-contacts', (0, AuthMiddleware_1.default)(user_constant_1.UserRole.admin, user_constant_1.UserRole.super_admin), Contact_controller_1.default.getAllContacts);
const ContactRoutes = router;
exports.default = ContactRoutes;
