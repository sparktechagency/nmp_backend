import { Request } from "express";
import cloudinary from "../../../helper/cloudinary";
import ApiError from "../../../errors/ApiError";
import ProductModel from "../Product.model";
import { Types } from "mongoose";


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
    const file = req.file as Express.Multer.File;
    const cloudinaryRes = await cloudinary.uploader.upload(file.path, {
      folder: 'NMP-Ecommerce',
      // width: 300,
      // crop: 'scale',
    });
    image = cloudinaryRes?.secure_url;
    // fs.unlink(file.path);
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
