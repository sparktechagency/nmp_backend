import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createShippingCostService, getAllShippingCostsService, updateShippingCostService, deleteShippingCostService, getMyShippingCostService } from './ShippingCost.service';

const createShippingCost = catchAsync(async (req, res) => {
  const result = await createShippingCostService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'ShippingCost is created successfully',
    data: result,
  });
});

const getMyShippingCost = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getMyShippingCostService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping Cost is retrieved successfully',
    data: result,
  });
});


const getAllShippingCosts = catchAsync(async (req, res) => {
  const result = await getAllShippingCostsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ShippingCosts are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateShippingCost = catchAsync(async (req, res) => {
  const { shippingCostId } = req.params;
  const result = await updateShippingCostService(shippingCostId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ShippingCost is updated successfully',
    data: result,
  });
});

const deleteShippingCost = catchAsync(async (req, res) => {
  const { shippingCostId } = req.params;
  const result = await deleteShippingCostService(shippingCostId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ShippingCost is deleted successfully',
    data: result,
  });
});

const ShippingCostController = {
  createShippingCost,
  getMyShippingCost,
  getAllShippingCosts,
  updateShippingCost,
  deleteShippingCost,
};
export default ShippingCostController;
