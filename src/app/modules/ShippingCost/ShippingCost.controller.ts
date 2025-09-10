import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createShippingCostService, getSingleShippingCostService, getAllShippingCostsService, updateShippingCostService, deleteShippingCostService } from './ShippingCost.service';

const createShippingCost = catchAsync(async (req, res) => {
  const result = await createShippingCostService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'ShippingCost is created successfully',
    data: result,
  });
});

const getSingleShippingCost = catchAsync(async (req, res) => {
  const { shippingcostId } = req.params;
  const result = await getSingleShippingCostService(shippingcostId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ShippingCost is retrieved successfully',
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
  const { shippingcostId } = req.params;
  const result = await updateShippingCostService(shippingcostId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ShippingCost is updated successfully',
    data: result,
  });
});

const deleteShippingCost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteShippingCostService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'ShippingCost is deleted successfully',
    data: result,
  });
});

const ShippingCostController = {
  createShippingCost,
  getSingleShippingCost,
  getAllShippingCosts,
  updateShippingCost,
  deleteShippingCost,
};
export default ShippingCostController;
