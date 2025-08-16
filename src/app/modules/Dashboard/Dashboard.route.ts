import express from "express";
import AuthMiddleware from "../../middlewares/AuthMiddleware";
import DashboardController from "./Dashboard.Controller";

const router = express.Router()


router.get('/get-stats', AuthMiddleware("super_admin", "admin"), DashboardController.getStats);
router.get('/get-user-overview/:year', AuthMiddleware("super_admin", "admin"), DashboardController.getUserOverview);
router.get('/get-income-overview/:year', AuthMiddleware("super_admin", "admin"), DashboardController.getIncomeOverview);


const DashboardRoutes = router;
export default DashboardRoutes;
