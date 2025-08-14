import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TPolicyType } from './Policy.interface';
import { getPolicyByTypeService, createUpdatePolicyService } from './Policy.service';

const createUpdatePolicy = catchAsync(async (req, res) => {
  const result = await createUpdatePolicyService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is updated successfully',
    data: result,
  });
});




const getPolicyByType = catchAsync(async (req, res) => {
  const { type } = req.params;
  const result = await getPolicyByTypeService(type as TPolicyType);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Policy is retrieved successfully',
    data: result,
  });
});




const PolicyController = {
  createUpdatePolicy,
  getPolicyByType,
};
export default PolicyController;
