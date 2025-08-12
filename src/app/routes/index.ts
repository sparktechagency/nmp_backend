import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import CategoryRoutes from '../modules/Category/Category.route';
import BrandRoutes from '../modules/Brand/Brand.route';
import FlavorRoutes from '../modules/Flavor/Flavor.route';



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
    }
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;