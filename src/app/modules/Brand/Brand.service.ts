import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import BrandModel from "./Brand.model";
import { Types } from "mongoose";
// import ProductModel from "../Product/Product.model";
import { makeSearchQuery } from "../../helper/QueryBuilder";
import { TBrandQuery } from "./Brand.interface";
import { BrandSearchableFields } from "./Brand.constant";


const createBrandService = async (name: string) => {
    const slug = slugify(name).toLowerCase();
    
    //check brand is already existed
    const brand = await BrandModel.findOne({
        slug
    });

    if(brand){
        throw new ApiError(409, 'This brand is already existed');
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
    const result = await BrandModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}


const updateBrandService = async (brandId: string, name: string) => {
    if (!Types.ObjectId.isValid(brandId)) {
        throw new ApiError(400, "brandId must be a valid ObjectId")
    }

    const existingBrand = await BrandModel.findById(brandId);
    if (!existingBrand) {
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

const deleteBrandService = async (brandId: string) => {
    const brand = await BrandModel.findById(brandId)
    if(!brand){
        throw new ApiError(404, 'This brandId not found');
    }

    //check if brandId is associated with Product
    // const associateWithProduct = await ProductModel.findOne({
    //      brandId
    // });
    // if(associateWithProduct){
    //     throw new ApiError(409, 'Failled to delete, This brand is associated with Product');
    // }

    const result = await BrandModel.deleteOne({ _id: brandId})
    return result;
}



export {
    createBrandService,
    getBrandsService,
    getBrandDropDownService,
    updateBrandService,
    deleteBrandService
}