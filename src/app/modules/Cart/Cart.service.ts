
import ApiError from '../../errors/ApiError';
import { ICartPayload } from './Cart.interface';
import CartModel from './Cart.model';
import ProductModel from '../Product/Product.model';
import { Types } from "mongoose";

const createCartService = async (
  loginUserId: string,
  payload: ICartPayload,
) => {
  const { productId } = payload;

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "productId not found");
  }

  //check product status
  if(product.status==="hidden"){
    throw new ApiError(404, "This product is hidden")
  }



  //check product has already been added to your cart
  const cart = await CartModel.findOne({
    userId: loginUserId,
    productId,
  });
  if (cart) {
    throw new ApiError(409, "This product has already been added to your cart");
  }

  const result = await CartModel.create({
    ...payload,
    userId: loginUserId,
    name: product.name,
    price: product.currentPrice,
    image: product.image
  });
  return result;
};

const getCartsService = async (loginUserId: string) => {
  const result = await CartModel.aggregate([
    {
      $match: {
         userId: new Types.ObjectId(loginUserId)
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        price: 1,
        quantity: 1,
        image:1
      },
    },
    { $sort: { createdAt: -1 } }, 
  ]);



  return result?.length > 0 ? result?.map((cv)=>({
    ...cv,
    total: Number(cv.price) * Number(cv.quantity)
  })) : [];
};

const updateCartService = async (loginUserId: string, cartId: string, payload: any) => {
  if (!Types.ObjectId.isValid(cartId)) {
    throw new ApiError(400, "cartId must be a valid ObjectId")
  }

  const cart = await CartModel.findOne({
    _id: cartId,
    userId: loginUserId
  });
  if (!cart) {
    throw new ApiError(404, "cartId not found");
  }
  const result = await CartModel.updateOne(
    { userId: loginUserId, _id: cartId },
    payload,
  );

  return result;
};

const deleteCartService = async (loginUserId: string, cartId: string) => {
  if (!Types.ObjectId.isValid(cartId)) {
    throw new ApiError(400, "cartId must be a valid ObjectId")
  }
  
  //check cartId
  const cart = await CartModel.findOne({
    _id: cartId,
    userId: loginUserId
  });
  if (!cart) {
    throw new ApiError(404, "cartId not found");
  }

  const result = await CartModel.deleteOne({ _id:cartId, userId: loginUserId });
  return result;
};

export {
  createCartService,
  getCartsService,
  updateCartService,
  deleteCartService,
};
