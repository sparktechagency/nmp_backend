import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createInformationService, getInformationService } from './Information.service';

const createInformation = catchAsync(async (req, res) => {
  const result = await createInformationService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Information is updated successfully',
    data: result,
  });
});


const getInformation = catchAsync(async (req, res) => {
  const result = await getInformationService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Information is retrieved successfully',
    data: result,
  });
});



const InformationController = {
  createInformation,
  getInformation
};
export default InformationController;
