import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { OrderValidFields, UserOrderValidFields } from './Order.constant';
import { createOrderService, getSingleOrderService, getAllOrdersService, updateOrderService, deleteOrderService, getUserOrdersService, verifySessionService, getExportOrdersService } from './Order.service';

const createOrder = catchAsync(async (req, res) => {
   const result = await createOrderService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order is initiated successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await getSingleOrderService(orderId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order is retrieved successfully',
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const validatedQuery = pickValidFields(req.query, UserOrderValidFields);
  const result = await getUserOrdersService(loginUserId as string, validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders are retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, OrderValidFields);
  const result = await getAllOrdersService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders are retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getExportOrders = catchAsync(async (req, res) => {
  const result = await getExportOrdersService();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Orders are retrieved successfully',
    data: result
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await updateOrderService(orderId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order is updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteOrderService(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order is deleted successfully',
    data: result,
  });
});



const verifySession = catchAsync(async (req, res) => {
  const { sessionId } = req.query;
  const result = await verifySessionService(sessionId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment Successful',
    data: result,
  });
});



const OrderController = {
  createOrder,
  getSingleOrder,
  getUserOrders,
  getAllOrders,
  getExportOrders,
  updateOrder,
  deleteOrder,
  verifySession,
};
export default OrderController;
