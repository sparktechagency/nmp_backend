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
import TypeModel from "../../Type/Type.model";



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

  const { name, typeId, categoryId, brandId, flavorId, description, currentPrice, originalPrice, discount, quantity, status } = reqBody;

  let payload: Record<string, unknown> ={}

  if(!name){
    throw new ApiError(400, "name is required!");
  }
  if(!typeId){
    throw new ApiError(400, "typeId is required!");
  }
  if (!Types.ObjectId.isValid(typeId)) {
    throw new ApiError(400, "typeId must be a valid ObjectId")
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
  if (Number(currentPrice) <= 0) {
    throw new ApiError(400, "Current price must be greater than 0");
  }


  //check quantity
  if (!quantity) {
    throw new ApiError(400, "quantity is required!");
  }
  if (typeof Number(quantity) !== "number" || isNaN(Number(quantity))) {
    throw new ApiError(400, "quantity must be a valid number");
  }
  // Step 4: Must be greater than 0
  if (Number(quantity) <= 0) {
    throw new ApiError(400, "quantity must be greater than 0");
  }

  //set required fields
  payload = {
    name,
    typeId,
    categoryId,
    description,
    currentPrice: Number(currentPrice),
    quantity: Number(quantity)
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

  //check typeId
  const existingType = await TypeModel.findById(typeId);
  if (!existingType) {
    throw new ApiError(404, 'This typeId not found');
  }

  //check categoryId
  const existingCategory = await CategoryModel.findById(categoryId);
  if (!existingCategory) {
    throw new ApiError(404, 'This categoryId not found');
  }

  //check categoryId is associated with specific type
  if(existingCategory.typeId.toString() !== typeId.toString()){
    throw new ApiError(400, "This categoryId is not associated with this type")
  }

  //check brandId
  if (brandId) {
    const existingBrand = await BrandModel.findById(brandId);
    if (!existingBrand) {
      throw new ApiError(404, 'This brandId not found');
    }

    //check brandId is associated with specific type
    if (existingBrand.typeId.toString() !== typeId.toString()) {
      throw new ApiError(400, "This brandId is not associated with this type")
    }
    payload.brandId = brandId
  }

  //check flavorId
  if (flavorId) {
    const existingFlavor = await FlavorModel.findById(flavorId);
    if (!existingFlavor) {
      throw new ApiError(404, 'This flavorId not found');
    }

    //check brandId is associated with specific type
    if (existingFlavor.typeId.toString() !== typeId.toString()) {
      throw new ApiError(400, "This brandId is not associated with this type")
    }
    payload.flavorId = flavorId
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