"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const Category_route_1 = __importDefault(require("../modules/Category/Category.route"));
const Brand_route_1 = __importDefault(require("../modules/Brand/Brand.route"));
const Flavor_route_1 = __importDefault(require("../modules/Flavor/Flavor.route"));
const Product_route_1 = __importDefault(require("../modules/Product/Product.route"));
const Cart_route_1 = __importDefault(require("../modules/Cart/Cart.route"));
const Order_route_1 = __importDefault(require("../modules/Order/Order.route"));
const Contact_route_1 = __importDefault(require("../modules/Contact/Contact.route"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes
    },
    {
        path: '/category',
        route: Category_route_1.default
    },
    {
        path: '/brand',
        route: Brand_route_1.default
    },
    {
        path: '/flavor',
        route: Flavor_route_1.default
    },
    {
        path: '/product',
        route: Product_route_1.default
    },
    {
        path: '/cart',
        route: Cart_route_1.default
    },
    {
        path: '/order',
        route: Order_route_1.default
    },
    {
        path: "/contact",
        route: Contact_route_1.default
    }
];
moduleRoutes.forEach((item, i) => router.use(item.path, item.route));
exports.default = router;
