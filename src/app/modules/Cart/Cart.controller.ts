import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createCartService, updateCartService, deleteCartService, getCartsService } from './Cart.service';

const createCart = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await createCartService(loginUserId as string, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product is added to cart',
    data: result,
  });
});


const getCarts = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getCartsService(loginUserId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Carts are retrieved successfully',
    data: result
  });
});

const updateCart = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { cartId } = req.params;
  const result = await updateCartService(loginUserId as string, cartId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart is updated successfully',
    data: result,
  });
});

const deleteCart = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { cartId } = req.params;
  const result = await deleteCartService(loginUserId as string, cartId,);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Cart is deleted successfully',
    data: result,
  });
});

const CartController = {
  createCart,
  getCarts,
  updateCart,
  deleteCart,
};
export default CartController;
