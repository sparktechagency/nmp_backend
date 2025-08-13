import { Types } from "mongoose";
import { IProduct } from "../Product.interface";
import ApiError from "../../../errors/ApiError";
import ProductModel from "../Product.model";
import slugify from "slugify";
import { Request } from "express";
import CategoryModel from "../../Category/Category.model";
import BrandModel from "../../Brand/Brand.model";
import FlavorModel from "../../Flavor/Flavor.model";


const UpdateProductService = async (req:Request, productId: string, payload: Partial<IProduct>) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  if((Number(payload.originalPrice) > 0) && !payload.currentPrice){
    if(product.currentPrice > Number(payload.originalPrice)){
      throw new ApiError(400, "Original price must be more than current price1")
    }
  }

  if(!payload.originalPrice && payload.currentPrice && Number(product?.originalPrice) > 0){
    if(payload.currentPrice > Number(product?.originalPrice)){
      throw new ApiError(400, "Current price must be less than original price")
    }
  }

  if(payload.currentPrice && Number(payload.originalPrice) > 0){
    if(payload.currentPrice > Number(payload.originalPrice)){
      throw new ApiError(400, "Original price must be more than current price2")
    }
  }


  //desctructuring the payload
  const { name, categoryId, brandId, flavorId } = payload;

  //check categoryId
  if (categoryId) {
    const category = await CategoryModel.findById(categoryId)
    if (!category) {
      throw new ApiError(404, 'This categoryId not found');
    }
  }

  //check brandId
  if (brandId) {
    const brand = await BrandModel.findById(brandId)
    if (!brand) {
      throw new ApiError(404, 'This brandId not found');
    }
  }

  //check flavorId
  if (flavorId) {
    const flavor = await FlavorModel.findById(flavorId)
    if (!flavor) {
      throw new ApiError(404, 'This flavorId not found');
    }
  }
 
  //check product name is already existed
  if (name) {
    const slug = slugify(name).toLowerCase();
    payload.slug = slug;
    const existingProductName = await ProductModel.findOne({
      _id: { $ne: productId },
      slug
    })

    if (existingProductName) {
      throw new ApiError(409, 'This Product name is already existed');
    }
  }

 
  //update the product
  const result = await ProductModel.updateOne(
    { _id: productId },
    payload,
    { runValidators: true}
  );

  return result;
};


export default UpdateProductService;