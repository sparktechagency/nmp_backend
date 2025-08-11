import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import CategoryRoutes from '../modules/Category/Category.route';



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
    }
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;