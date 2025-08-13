import mongoose, { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import ProductModel from "../Product.model";
import ObjectId from "../../../utils/ObjectId";
import OrderModel from "../../Order/Order.model";
import CartModel from "../../Cart/Cart.model";
import ReviewModel from "../../Review/review.model";


const DeleteProductService = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }
  const product = await ProductModel.findById(productId);
  if(!product){
    throw new ApiError(404, "Product Not Found");
  }

  //check product is associated with order
  const associateWithOrder = await OrderModel.findOne({
    'products.productId': productId
  });

  if(associateWithOrder) {
    throw new ApiError(409, 'Failled to delete, This product is associated with Order');
  }


   //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // //delete from cart list
    await CartModel.deleteMany(
      { productId: new ObjectId(productId) },
      { session }
    );

    //delete the reviews
    await ReviewModel.deleteMany(
      { productId: new ObjectId(productId) },
      { session }
    );


    //delete product
    const result = await ProductModel.deleteOne(
      { _id: new ObjectId(productId) },
      { session }
    );

    //transaction success
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export default DeleteProductService;