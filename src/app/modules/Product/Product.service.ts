import ApiError from '../../errors/ApiError';
import { ProductSearchableFields } from './Product.constant';
import { IProduct, TProductQuery } from './Product.interface';
import ProductModel from './Product.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import slugify from 'slugify';
import CategoryModel from '../Category/Category.model';
import { Request } from 'express';
import mongoose, { Types } from "mongoose";
import hasDuplicates from '../../utils/hasDuplicates';
import ObjectId from '../../utils/ObjectId';
import cloudinary from '../../helper/cloudinary';
import BrandModel from '../Brand/Brand.model';
import FlavorModel from '../Flavor/Flavor.model';


const createProductService = async (
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

const getUserProductsService = async (query: TProductQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt",
    ratings, 
    categoryId,
    brandId,
    flavorId,
    fromPrice,
    toPrice,
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
 // const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, ProductSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }



//filter by category
 if (categoryId) {
    if (typeof categoryId === "string") {
      //check ObjectId
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new ApiError(400, "categoryId must be valid ObjectId")
      }
      filterQuery = {
        ...filterQuery,
        categoryId: { $in: [new Types.ObjectId(categoryId)] }
      }
    }

    if (Array.isArray(categoryId)) {
      for (let i = 0; i < categoryId.length; i++) {
        if (!Types.ObjectId.isValid(categoryId[i])) {
          throw new ApiError(400, "categoryId must be valid ObjectId")
        }
      }
      if(hasDuplicates(categoryId)){
        throw new ApiError(400, "categoryId can not be duplicate value")
      }
      const categoryObjectIds = categoryId?.map(id => Types.ObjectId.createFromHexString(id));
      filterQuery = {
        ...filterQuery,
        categoryId: { $in: categoryObjectIds}
      }
    }
  }


//filter by brand
 if (brandId) {
    if (typeof brandId === "string") {
      //check ObjectId
      if (!Types.ObjectId.isValid(brandId)) {
        throw new ApiError(400, "brandId must be valid ObjectId")
      }
      filterQuery = {
        ...filterQuery,
        brandId: { $in: [new Types.ObjectId(brandId)] }
      }
    }

    if (Array.isArray(brandId)) {
      for (let i = 0; i < brandId.length; i++) {
        if (!Types.ObjectId.isValid(brandId[i])) {
          throw new ApiError(400, "brandId must be valid ObjectId")
        }
      }
      if(hasDuplicates(brandId)){
        throw new ApiError(400, "brandId can not be duplicate value")
      }
      const brandObjectIds = brandId?.map(id => Types.ObjectId.createFromHexString(id));
      filterQuery = {
        ...filterQuery,
        brandId: { $in: brandObjectIds}
      }
    }
  }


//filter by flavor
 if (flavorId) {
    if (typeof flavorId === "string") {
      //check ObjectId
      if (!Types.ObjectId.isValid(flavorId)) {
        throw new ApiError(400, "flavorId must be valid ObjectId")
      }
      filterQuery = {
        ...filterQuery,
        flavorId: { $in: [new Types.ObjectId(flavorId)] }
      }
    }

    if (Array.isArray(flavorId)) {
      for (let i = 0; i < flavorId.length; i++) {
        if (!Types.ObjectId.isValid(flavorId[i])) {
          throw new ApiError(400, "flavorId must be valid ObjectId")
        }
      }
      if(hasDuplicates(flavorId)){
        throw new ApiError(400, "flavorId can not be duplicate value")
      }
      const flavorObjectIds = flavorId?.map(id => Types.ObjectId.createFromHexString(id));
      filterQuery = {
        ...filterQuery,
        flavorId: { $in: flavorObjectIds}
      }
    }
  }



  //filter by ratings
  if (ratings) {
    if (typeof Number(ratings) !== "number" || isNaN(Number(ratings))) {
      throw new ApiError(400, "ratings must be a valid number");
    }
    if(Number(ratings) > 5){
      throw new ApiError(400, "ratings value must be between 1-5");
    }
    if (Number(ratings) > 0) {
      filterQuery = {
        ...filterQuery,
        ratings: Number(ratings)
      }
    }
  }


  //filter by price range
  if(fromPrice && toPrice){
    if (typeof Number(fromPrice) !== "number" || isNaN(Number(fromPrice))) {
      throw new ApiError(400, "fromPrice must be a valid number");
    }
    if (typeof Number(toPrice) !== "number" || isNaN(Number(toPrice))) {
      throw new ApiError(400, "toPrice must be a valid number");
    }

    if(Number(fromPrice) >= Number(toPrice)){
      throw new ApiError(400, "toPrice must be greater than fromPrice");
    }

    if (Number(fromPrice) >= 0 && Number(toPrice) > 0) {
      filterQuery = {
        ...filterQuery,
        currentPrice: { $gte: Number(fromPrice), $lte: Number(toPrice) },
      };
    }
  }


  const result = await ProductModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand"
      }
    },
    {
      $unwind: "$brand"
    },
    {
      $lookup: {
        from: "flavors",
        localField: "flavorId",
        foreignField: "_id",
        as: "flavor"
      }
    },
    {
      $unwind: "$flavor"
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId:1,
        brandId:1,
        flavorId:1,
        category: "$category.name",
        brand: "$brand.name",
        flavor: "$flavor.name",
        currentPrice: "$currentPrice",
        originalPrice: "$originalPrice",
        discount: "$discount",
        ratings: "$ratings",
        totalReview: "$totalReview",
        images: "$images",
        status: "$status",
        stockStatus: "$stockStatus"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery,
        status: "visible"
      }
    },
    {
      $project: {
        categoryId:0,
        brandId:0,
        flavorId:0,
        status:0,
      }
    },
    { $sort: { ratings: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

     // total count
  const totalCountResult = await ProductModel.aggregate([
   {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand"
      }
    },
    {
      $unwind: "$brand"
    },
    {
      $lookup: {
        from: "flavors",
        localField: "flavorId",
        foreignField: "_id",
        as: "flavor"
      }
    },
    {
      $unwind: "$flavor"
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId:1,
        brandId:1,
        flavorId:1,
        category: "$category.name",
        brand: "$brand.name",
        flavor: "$flavor.name",
        currentPrice: "$currentPrice",
        originalPrice: "$originalPrice",
        discount: "$discount",
        ratings: "$ratings",
        totalReview: "$totalReview",
        images: "$images",
        status: "$status",
        stockStatus: "$stockStatus"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery,
        status: "visible"
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), 
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};
const getProductsService = async (query: TProductQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
 const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, ProductSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ProductModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
   {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: 1,
        categoryName: "$category.name",
        currentPrice: "$currentPrice",
        originalPrice: "$originalPrice",
        discount: "$discount",
        ratings: "$ratings",
        createdAt: "$createdAt",
        totalReview: "$totalReview",
        images: "$images",
        status: "$status",
        stockStatus: "$stockStatus",
      },
    },
    {
      $match: {
        ...searchQuery, 
        ...filterQuery
    },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalCountResult = await ProductModel.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: 1,
        categoryName: "$category.name",
        currentPrice: "$currentPrice",
        originalPrice: "$originalPrice",
        discount: "$discount",
        ratings: "$ratings",
        totalReview: "$totalReview",
        images: "$images",
        colors: "$colors",
        sizes: "$sizes",
        introduction: "$introduction",
        description: "$description",
        status: "$status",
        stockStatus: "$stockStatus"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), 
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getSingleProductService = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  const product = await ProductModel.aggregate([
    {
      $match: { _id: new ObjectId(productId) }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand"
      }
    },
    {
      $unwind: "$brand"
    },
    {
      $lookup: {
        from: "flavors",
        localField: "flavorId",
        foreignField: "_id",
        as: "flavor"
      }
    },
    {
      $unwind: "$flavor"
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        category: "$category.name",
        brand: "$brand.name",
        flavor: "$flavor.name",
        currentPrice: "$currentPrice",
        originalPrice: "$originalPrice",
        discount: "$discount",
        ratings: "$ratings",
        totalReview: "$totalReview",
        images: "$images",
        introduction: "$introduction",
        description: "$description",
        stockStatus: "$stockStatus"
      },
    },
  ]);

  if (product.length===0) {
    throw new ApiError(404, 'Product Not Found');
  }

  

  return product[0];
  
};

const getProductService = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  const product = await ProductModel.aggregate([
    {
      $match: { _id: new ObjectId(productId) }
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: "$category"
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand"
      }
    },
    {
      $unwind: "$brand"
    },
    {
      $lookup: {
        from: "flavors",
        localField: "flavorId",
        foreignField: "_id",
        as: "flavor"
      }
    },
    {
      $unwind: "$flavor"
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "productId",
        as: "reviews",
      },
    },
    {
      $addFields: {
        totalReview: { $size: "$reviews" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        categoryId: "$categoryId",
        category: "$category.name",
        brandId: "$brandId",
        brand: "$brand.name",
        flavorId: "$flavorId",
        flavor: "$flavor.name",
        currentPrice: "$currentPrice",
        originalPrice: "$originalPrice",
        discount: "$discount",
        ratings: "$ratings",
        totalReview: "$totalReview",
        images: "$images",
        introduction: "$introduction",
        description: "$description",
        status: "$status",
        stockStatus: "$stockStatus"
      },
    },
  ]);

  if (product.length===0) {
    throw new ApiError(404, 'Product Not Found');
  }

  

  return product[0];
  
};

const updateProductService = async (req:Request, productId: string, payload: Partial<IProduct>) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }

  //check product
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product Not Found");
  }

  if(Number(payload.originalPrice) > 0){
    console.log("log", payload.originalPrice)
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
  const { name } = payload;
 
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

const updateProductImgService = async (req: Request, productId: string) => {
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

const deleteProductService = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "productId must be a valid ObjectId")
  }
  const product = await ProductModel.findById(productId);
  if(!product){
    throw new ApiError(404, "Product Not Found");
  }

  //check product is associated with order
  // const associateWithOrder = await OrderModel.findOne({
  //   'products.productId': productId
  // });

  // if(associateWithOrder) {
  //   throw new ApiError(409, 'Failled to delete, This product is associated with Order');
  // }


   //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //delete favourite list
    // await FavouriteModel.deleteMany(
    //   { productId: new ObjectId(productId) },
    //   { session }
    // );

    // //delete from cart list
    // await CartModel.deleteMany(
    //   { productId: new ObjectId(productId) },
    //   { session }
    // );

    //delete the reviews
    // await ReviewModel.deleteMany(
    //   { restaurantId: new ObjectId(restaurant._id) },
    //   { session }
    // );


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

export {
  createProductService,
  getUserProductsService,
  getProductsService,
  getSingleProductService,
  getProductService,
  updateProductService,
  updateProductImgService,
  deleteProductService,
};
