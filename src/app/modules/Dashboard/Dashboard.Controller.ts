import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { getIncomeOverviewService, getStatsService, getUserOverviewService } from "./Dashboard.service";


const getStats = catchAsync(async (req, res) => {
  const result = await getStatsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stats retrieved successfully',
    data: result,
  });
});

const getUserOverview = catchAsync(async (req, res) => {
  const { year } = req.params;
  const result = await getUserOverviewService(year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User overview is retrieved successfully',
    data: result,
  });
});


const getIncomeOverview = catchAsync(async (req, res) => {
  const { year } = req.params;
  const result = await getIncomeOverviewService(year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Income overview is retrieved successfully',
    data: result,
  });
});



const DashboardController = {
  getStats,
  getUserOverview,
  getIncomeOverview
}

export default DashboardController;