import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import CategoryModel from "./Category.model";
import { Types } from "mongoose";
import { ICategory, TCategoryQuery } from "./Category.interface";
import { CategorySearchableFields } from "./Category.constant";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import ProductModel from "../Product/Product.model";
import TypeModel from "../Type/Type.model";



const createCategoryService = async (payload: ICategory) => {
  const { name, typeId } = payload;
  const slug = slugify(payload.name).toLowerCase();

  //check typeId
  const type = await TypeModel.findById(typeId)
  if (!type) {
    throw new ApiError(404, 'This typeId not found');
  }

  //check category is already existed
  const category = await CategoryModel.findOne({
    slug,
  });

  if (category) {
    throw new ApiError(409, 'This category is already existed');
  }

  const result = await CategoryModel.create({
    name,
    slug,
    typeId
  })
  return result;
}

const getCategoriesService = async (query: TCategoryQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, CategorySearchableFields);
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

 
  const result = await CategoryModel.aggregate([
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
  const totalCountResult = await CategoryModel.aggregate([
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

const getCategoryDropDownService = async (typeId: string) => {
  if (!Types.ObjectId.isValid(typeId)) {
    throw new ApiError(400, "typeId must be a valid ObjectId")
  }

  const result = await CategoryModel.find({ typeId }).select('name').sort('-createdAt');
  return result;
}


const updateCategoryService = async (categoryId: string, payload: Partial<ICategory>) => {
  const { typeId, name } = payload;
  if (!Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "categoryId must be a valid ObjectId")
  }

  const existingCategory = await CategoryModel.findById(categoryId);
  if (!existingCategory) {
    throw new ApiError(404, 'This categoryId not found');
  }

  //check type
  if (typeId) {
    const existingType = await TypeModel.findById(typeId);
    if (!existingType) {
      throw new ApiError(404, 'This typeId not found');
    }
  }

  if(name){
    const slug = slugify(name).toLowerCase();
    //set slug
    payload.slug=slug;
    const categoryExist = await CategoryModel.findOne({
      _id: { $ne: categoryId },
      slug
    })
    if (categoryExist) {
      throw new ApiError(409, 'Sorry! This category is already existed');
    }
  }

  const result = await CategoryModel.updateOne(
    { _id: categoryId },
    payload
  )

  return result;
}

const deleteCategoryService = async (categoryId: string) => {
    const category = await CategoryModel.findById(categoryId)
    if(!category){
        throw new ApiError(404, 'This categoryId not found');
    }

    //check if categoryId is associated with Product
    const associateWithProduct = await ProductModel.findOne({
         categoryId
    });
    if(associateWithProduct){
        throw new ApiError(409, 'Failed to delete, This category is associated with Product');
    }

    const result = await CategoryModel.deleteOne({ _id: categoryId})
    return result;
}



export {
    createCategoryService,
    getCategoriesService,
    getCategoryDropDownService,
    updateCategoryService,
    deleteCategoryService
}