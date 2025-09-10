import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import CategoryRoutes from '../modules/Category/Category.route';
import BrandRoutes from '../modules/Brand/Brand.route';
import FlavorRoutes from '../modules/Flavor/Flavor.route';
import ProductRoutes from '../modules/Product/Product.route';
import CartRoutes from '../modules/Cart/Cart.route';
import OrderRoutes from '../modules/Order/Order.route';
import ContactRoutes from '../modules/Contact/Contact.route';
import ReviewRoutes from '../modules/Review/review.route';
import InformationRoutes from '../modules/Information/Information.route';
import PolicyRoutes from '../modules/Policy/Policy.route';
import AdminRoutes from '../modules/Admin/admin.route';
import DashboardRoutes from '../modules/Dashboard/Dashboard.route';
import TypeRoutes from '../modules/Type/Type.route';
import ShippingCostRoutes from '../modules/ShippingCost/ShippingCost.route';



const router = express.Router();


const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/type',
        route: TypeRoutes
    },
    {
        path: '/category',
        route: CategoryRoutes
    },
    {
        path: '/brand',
        route: BrandRoutes
    },
    {
        path: '/flavor',
        route: FlavorRoutes
    },
    {
        path: '/product',
        route: ProductRoutes
    },
    {
        path: '/cart',
        route: CartRoutes
    },
    {
        path: '/order',
        route: OrderRoutes
    },
    {
        path: "/contact",
        route: ContactRoutes
    },
    {
        path: "/review",
        route: ReviewRoutes
    },
    {
        path: "/information",
        route: InformationRoutes
    },
    {
        path: "/policy",
        route: PolicyRoutes
    },
    {
        path: "/dashboard",
        route: DashboardRoutes
    },
    {
        path: "/shipping-cost",
        route: ShippingCostRoutes
    }
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;