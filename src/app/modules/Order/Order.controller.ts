import catchAsync from '../../utils/catchAsync';
import pickValidFields from '../../utils/pickValidFields';
import sendResponse from '../../utils/sendResponse';
import { OrderValidFields, UserOrderValidFields } from './Order.constant';
import { createOrderService, getSingleOrderService, getAllOrdersService, updateOrderService, getUserOrdersService, verifySessionService, getExportOrdersService, createOrderWithCashService, updateTipsService } from './Order.service';

const createOrder = catchAsync(async (req, res) => {
   const result = await createOrderService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order is initiated successfully',
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


const createOrderWithCash = catchAsync(async (req, res) => {
   const result = await createOrderWithCashService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Order is placed successfully',
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
  const userEmail = req.headers.email;
  const validatedQuery = pickValidFields(req.query, UserOrderValidFields);
  const result = await getUserOrdersService(userEmail as string, validatedQuery);

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


const updateTips = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { tips } = req.body;
  const result = await updateTipsService(orderId, tips);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Order is updated successfully',
    data: result,
  });
});




const OrderController = {
  createOrder,
  verifySession,
  createOrderWithCash,
  getSingleOrder,
  getUserOrders,
  getAllOrders,
  getExportOrders,
  updateOrder,
  updateTips
};
export default OrderController;
