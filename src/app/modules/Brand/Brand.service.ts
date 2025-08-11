import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import CategoryModel from "./Brand.model";
import { Types } from "mongoose";
// import ProductModel from "../Product/Product.model";
import { makeSearchQuery } from "../../helper/QueryBuilder";
import { TBrandQuery } from "./Brand.interface";
import { BrandSearchableFields } from "./Brand.constant";
import BrandModel from "./Brand.model";


const createBrandService = async (name: string) => {
    const slug = slugify(name).toLowerCase();
    
    //check category is already existed
    const category = await BrandModel.findOne({
        slug
    });

    if(category){
        throw new ApiError(409, 'This category is already existed');
    }


    const result = await BrandModel.create({
         name,
         slug
    })
    return result;
}

const getBrandsService = async (query: TBrandQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, BrandSearchableFields);
  }

 
  const result = await BrandModel.aggregate([
    {
      $match: {
        ...searchQuery, // Apply search query
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    {
      $project: {
        _id: 1,
        name: 1,
      },
    },
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count
  const totalCountResult = await BrandModel.aggregate([
    {
      $match: {
        ...searchQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getBrandDropDownService = async () => {
    const result = await CategoryModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}


const updateBrandService = async (brandId: string, name: string) => {
    if (!Types.ObjectId.isValid(brandId)) {
        throw new ApiError(400, "categoryId must be a valid ObjectId")
    }

    const existingCategory = await BrandModel.findById(brandId);
    if (!existingCategory) {
        throw new ApiError(404, 'This brandId not found');
    }

    const slug = slugify(name).toLowerCase();
    const brandExist = await BrandModel.findOne({
        _id: { $ne: brandId },
        slug
    })
    if (brandExist) {
        throw new ApiError(409, 'Sorry! This brand is already existed');
    }

    const result = await BrandModel.updateOne(
        { _id: brandId },
        {
            name,
            slug
        }
    )

    return result;
}

const deleteBrandService = async (categoryId: string) => {
    const category = await CategoryModel.findById(categoryId)
    if(!category){
        throw new ApiError(404, 'This categoryId not found');
    }

    //check if categoryId is associated with Product
    // const associateWithProduct = await ProductModel.findOne({
    //      categoryId
    // });
    // if(associateWithProduct){
    //     throw new ApiError(409, 'Failled to delete, This category is associated with Product');
    // }

    const result = await CategoryModel.deleteOne({ _id: categoryId})
    return result;
}



export {
    createBrandService,
    getBrandsService,
    getBrandDropDownService,
    updateBrandService,
    deleteBrandService
}