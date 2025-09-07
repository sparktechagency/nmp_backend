import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import TypeModel from "./Type.model";
import { Types } from "mongoose";
import { TTypeQuery } from "./Type.interface";
import { TypeSearchableFields } from "./Type.constant";
import { makeSearchQuery } from "../../helper/QueryBuilder";
import ProductModel from "../Product/Product.model";
import CategoryModel from "../Category/Category.model";
import BrandModel from "../Brand/Brand.model";
import FlavorModel from "../Flavor/Flavor.model";



const createTypeService = async (name: string) => {
    const slug = slugify(name).toLowerCase();
    
    //check type is already existed
    const type = await TypeModel.findOne({
        slug
    });

    if(type){
        throw new ApiError(409, 'This type is already existed');
    }

    const result = await TypeModel.create({
         name,
         slug
    })
    return result;
}

const getTypesService = async (query: TTypeQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, TypeSearchableFields);
  }

 
  const result = await TypeModel.aggregate([
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
  const totalCountResult = await TypeModel.aggregate([
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

const getTypeDropDownService = async () => {
    const result = await TypeModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}

const getFilterOptionsService = async (typeId: string) => {
  if (!Types.ObjectId.isValid(typeId)) {
    throw new ApiError(400, "typeId must be a valid ObjectId");
  }

  const filterQuery = {typeId, status:"visible"};

  const categoryDropDown = await CategoryModel.find(filterQuery).select('name').sort('-createdAt');
  const brandDropDown = await BrandModel.find(filterQuery).select('name').sort('-createdAt');
  const flavorDropDown = await FlavorModel.find(filterQuery).select('-createdAt -updatedAt -slug').sort('-createdAt');
  
  return {
    categoryDropDown,
    brandDropDown,
    flavorDropDown
  };
};


const updateTypeService = async (typeId: string, name: string) => {
    if (!Types.ObjectId.isValid(typeId)) {
        throw new ApiError(400, "typeId must be a valid ObjectId")
    }

    const existingType = await TypeModel.findById(typeId);
    if (!existingType) {
        throw new ApiError(404, 'This typeId not found');
    }

    const slug = slugify(name).toLowerCase();
    const typeExist = await TypeModel.findOne({
        _id: { $ne: typeId },
        slug
    })
    if (typeExist) {
        throw new ApiError(409, 'Sorry! This type is already existed');
    }

    const result = await TypeModel.updateOne(
        { _id: typeId },
        {
            name,
            slug
        }
    )

    return result;
}

const deleteTypeService = async (typeId: string) => {
    const type = await TypeModel.findById(typeId)
    if(!type){
        throw new ApiError(404, 'This typeId not found');
    }

    //check if typeId is associated with Category
    const associateWithCategory = await CategoryModel.findOne({
         typeId
    });
    if(associateWithCategory){
        throw new ApiError(409, 'Failed to delete, This type is associated with Category');
    }

    //check if typeId is associated with Brand
    const associateWithBrand = await BrandModel.findOne({
         typeId
    });
    if(associateWithBrand){
        throw new ApiError(409, 'Failed to delete, This type is associated with Brand');
    }

    //check if typeId is associated with Flavor
    const associateWithFlavor = await FlavorModel.findOne({
         typeId
    });
    if(associateWithFlavor){
        throw new ApiError(409, 'Failed to delete, This type is associated with Flavor');
    }

    //check if typeId is associated with Product
    const associateWithProduct = await ProductModel.findOne({
         typeId
    });
    if(associateWithProduct){
        throw new ApiError(409, 'Failed to delete, This type is associated with Product');
    }

    const result = await TypeModel.deleteOne({ _id: typeId})
    return result;
}



export {
    createTypeService,
    getTypesService,
    getTypeDropDownService,
    updateTypeService,
    deleteTypeService,
    getFilterOptionsService
}