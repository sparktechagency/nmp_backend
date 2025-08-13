import { Request } from "express";
import ApiError from "../../../errors/ApiError";
import { IProduct } from "../Product.interface";
import { Types } from "mongoose";
import slugify from "slugify";
import ProductModel from "../Product.model";
import CategoryModel from "../../Category/Category.model";
import BrandModel from "../../Brand/Brand.model";
import FlavorModel from "../../Flavor/Flavor.model";
import cloudinary from "../../../helper/cloudinary";



const CreateProductService = async (
  req: Request,
  reqBody: IProduct,
) => {

  //destructuring the reqBody
  if(!reqBody){
    throw new ApiError(400, "name is required!");
  }

  const file = req.file as Express.Multer.File;
  if(!file){
    throw new ApiError(400, "Upload image");
  }

  const { name, categoryId, brandId, flavorId, description, currentPrice, originalPrice, discount, status, stockStatus } = reqBody;

  let payload: Record<string, unknown> ={}

  if(!name){
    throw new ApiError(400, "name is required!");
  }
  if(!categoryId){
    throw new ApiError(400, "categoryId is required!");
  }
  if (!Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "categoryId must be a valid ObjectId")
  }
  if(!brandId){
    throw new ApiError(400, "brandId is required!");
  }
  if (!Types.ObjectId.isValid(brandId)) {
    throw new ApiError(400, "brandId must be a valid ObjectId")
  }
  if(!flavorId){
    throw new ApiError(400, "flavorId is required!");
  }
  if (!Types.ObjectId.isValid(flavorId)) {
    throw new ApiError(400, "flavorId must be a valid ObjectId")
  }
  if(!description){
    throw new ApiError(400, "description is required!");
  }
  
  //check current price
  if (!currentPrice) {
    throw new ApiError(400, "currentPrice is required!");
  }
  if (typeof Number(currentPrice) !== "number" || isNaN(Number(currentPrice))) {
    throw new ApiError(400, "current price must be a valid number");
  }
  // Step 4: Must be greater than 0
  if (Number(currentPrice) <= 0) {
    throw new ApiError(400, "Current price must be greater than 0");
  }

  //set required fields
  payload = {
    name,
    categoryId,
    brandId,
    flavorId,
    description,
    currentPrice: Number(currentPrice),
  }


  //check original price
  if (originalPrice) {
    if (typeof Number(originalPrice) !== "number" || isNaN(Number(originalPrice))) {
      throw new ApiError(400, "original price must be a valid number");
    }
    // Step 4: Must be greater than 0
    if (Number(originalPrice) <= 0) {
      throw new ApiError(400, "original price must be greater than 0");
    }
    payload.originalPrice=Number(originalPrice)
  }


  //check discount
  if(discount){
    payload.discount=discount;
  }

  //check status
  if(status){
    if(!['visible', 'hidden'].includes(status)){
      throw new ApiError(400, "status must be one of: 'visible', 'hidden'");
    }
    payload.status= status;
  }

  //check stock status
  if(stockStatus){
    if(!['in_stock', 'stock_out', 'up_coming'].includes(stockStatus)){
      throw new ApiError(400, "Stock Status must be one of: in_stock', 'stock_out', 'up_coming'");
    }
    payload.stockStatus=stockStatus
  }
  
  //make slug
  const slug = slugify(name).toLowerCase();
  payload.slug = slug;

  //check product name is already existed
  const product = await ProductModel.findOne({
    slug
  });

  if (product) {
    throw new ApiError(409, "This name is already taken.")
  }

  //check categoryId
  const existingCategory = await CategoryModel.findById(categoryId);
  if (!existingCategory) {
    throw new ApiError(404, 'This categoryId not found');
  }

  //check brandId
  const existingBrand = await BrandModel.findById(brandId);
  if (!existingBrand) {
    throw new ApiError(404, 'This brandId not found');
  }

  //check flavorId
  const existingFlavor = await FlavorModel.findById(flavorId);
  if (!existingFlavor) {
    throw new ApiError(404, 'This flavorId not found');
  }

  //upload a image
  if (req.file && (req.file as Express.Multer.File)) {
    const file = req.file as Express.Multer.File;
    const cloudinaryRes = await cloudinary.uploader.upload(file.path, {
          folder: 'NMP-Ecommerce',
          // width: 300,
          // crop: 'scale',
        });
        payload.image=cloudinaryRes?.secure_url;
    // fs.unlink(file.path);
  }


  const result = await ProductModel.create({
    ...payload,
  });
  return result;
};


export default CreateProductService;