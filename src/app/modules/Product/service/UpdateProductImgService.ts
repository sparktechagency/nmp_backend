import { Request } from "express";
import ApiError from "../../../errors/ApiError";
import ProductModel from "../Product.model";
import { Types } from "mongoose";
import uploadImage from "../../../utils/uploadImage";


const UpdateProductImgService = async (req: Request, productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  const file = req.file as Express.Multer.File;
  if (!file) {
    throw new ApiError(400, "Upload image");
  }

  //upload a image
  let image: string = "";
  if (req.file && (req.file as Express.Multer.File)) {
    image = await uploadImage(req);
  }

  if (!image) {
    throw new ApiError(400, "upload a image")
  }

  const result = await ProductModel.updateOne(
    { _id: productId },
    { image },
    { runValidators: true }
  );

  return result;
}

export default UpdateProductImgService;
