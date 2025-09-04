import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import BrandModel from "./Brand.model";
import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { IBrand, TBrandQuery } from "./Brand.interface";
import { BrandSearchableFields } from "./Brand.constant";
import ProductModel from "../Product/Product.model";
import TypeModel from "../Type/Type.model";


const createBrandService = async (payload: IBrand) => {
  const { name, typeId } = payload;
  const slug = slugify(name).toLowerCase();
  //set slug
  payload.slug=slug

  //check typeId
  const type = await TypeModel.findById(typeId)
  if (!type) {
    throw new ApiError(404, 'This typeId not found');
  }

  //check brand is already existed
  const brand = await BrandModel.findOne({
    slug,
    typeId
  });

  if (brand) {
    throw new ApiError(409, 'This brand is already existed');
  }

  const result = await BrandModel.create(payload)
  return result;
}

const getBrandsService = async (query: TBrandQuery) => {
  const {
    searchTerm, 
    page = 1, 
    limit = 10, 
    sortOrder = "desc",
    sortBy = "createdAt", 
    typeId,
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

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  //check typeId
  if (typeId) {
    if (!Types.ObjectId.isValid(typeId)) {
      throw new ApiError(400, "typeId must be valid ObjectId")
    }
    filterQuery = {
      ...filterQuery,
      typeId: new Types.ObjectId(typeId)
    }
  }

 
  const result = await BrandModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    {
      $lookup: {
        from: "types",
        localField: "typeId",
        foreignField: "_id",
        as: "type"
      }
    },
    {
      $unwind: "$type"
    },
    {
      $project: {
        _id: 1,
        name: 1,
        typeId: 1,
        type: "$type.name",
        status: "$status",
      },
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count
  const totalCountResult = await BrandModel.aggregate([
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
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};


const getBrandDropDownService = async (typeId: string) => {
  if (!Types.ObjectId.isValid(typeId)) {
    throw new ApiError(400, "typeId must be a valid ObjectId")
  }

  const result = await BrandModel.find({ typeId }).select('name').sort('-createdAt');
  return result;
}


const updateBrandService = async (brandId: string, payload: Partial<IBrand>) => {
  const { typeId, name } = payload;

  if (!Types.ObjectId.isValid(brandId)) {
    throw new ApiError(400, "brandId must be a valid ObjectId")
  }

  const brand = await BrandModel.findById(brandId);
  if (!brand) {
    throw new ApiError(404, 'This brandId not found');
  }

  //check type
  if (typeId) {
    const existingType = await TypeModel.findById(typeId);
    if (!existingType) {
      throw new ApiError(404, 'This typeId not found');
    }
  }

  //check name
  if (name) {
    const slug = slugify(name).toLowerCase();
    //set slug
    payload.slug = slug;
    const brandExist = await BrandModel.findOne({
      _id: { $ne: brandId},
      typeId: brand.typeId,
      slug
    })
    if (brandExist) {
      throw new ApiError(409, 'Sorry! This brand is already existed');
    }

    console.log(brandExist)
  }

  const result = await BrandModel.updateOne(
    { _id: brandId },
    payload
  )

  return result;
}

const deleteBrandService = async (brandId: string) => {
    const brand = await BrandModel.findById(brandId)
    if(!brand){
        throw new ApiError(404, 'This brandId not found');
    }

    //check if brandId is associated with Product
    const associateWithProduct = await ProductModel.findOne({
         brandId
    });
    if(associateWithProduct){
        throw new ApiError(409, 'Failed to delete, This brand is associated with Product');
    }

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