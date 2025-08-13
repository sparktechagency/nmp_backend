"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Cart_controller_1 = __importDefault(require("./Cart.controller"));
const validationMiddleware_1 = __importDefault(require("../../middlewares/validationMiddleware"));
const Cart_validation_1 = require("./Cart.validation");
const AuthMiddleware_1 = __importDefault(require("../../middlewares/AuthMiddleware"));
const router = express_1.default.Router();
router.post('/create-cart', (0, AuthMiddleware_1.default)("user"), (0, validationMiddleware_1.default)(Cart_validation_1.createCartValidationSchema), Cart_controller_1.default.createCart);
router.get('/get-carts', (0, AuthMiddleware_1.default)("user"), Cart_controller_1.default.getCarts);
router.patch('/update-cart/:cartId', (0, AuthMiddleware_1.default)("user"), (0, validationMiddleware_1.default)(Cart_validation_1.updateCartValidationSchema), Cart_controller_1.default.updateCart);
router.delete('/delete-cart/:cartId', (0, AuthMiddleware_1.default)("user"), Cart_controller_1.default.deleteCart);
const CartRoutes = router;
exports.default = CartRoutes;
