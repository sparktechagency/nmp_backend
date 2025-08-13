import { Request } from "express";
import cloudinary from "../../../helper/cloudinary";
import ApiError from "../../../errors/ApiError";
import ProductModel from "../Product.model";


const UpdateProductImgService = async (req: Request, productId: string) => {
  let images: string[] = [];
  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    const files = req.files as Express.Multer.File[];
    // for (const file of files) {
    //   const path = `${req.protocol}://${req.get("host")}/uploads/${file?.filename}`;  //for local machine
    //   images.push(path)
    // }
    images = await Promise.all(
      files?.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'MTK-Ecommerce',
          // width: 300,
          // crop: 'scale',
        });

        // Delete local file (non-blocking)
        // fs.unlink(file.path);

        return result.secure_url;
      })
    );

  }
  else {
    throw new ApiError(400, "Minimum one image required");
  } 

  const result = await ProductModel.updateOne(
    { _id: productId },
    { images },
    { runValidators: true}
  );

  return result;
}

export default UpdateProductImgService;
