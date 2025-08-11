import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';



const router = express.Router();


const moduleRoutes = [
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/user',
        route: UserRoutes
    }
]

moduleRoutes.forEach((item, i)=> router.use(item.path, item.route));

export default router;