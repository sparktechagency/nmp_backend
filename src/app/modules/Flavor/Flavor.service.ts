import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import FlavorModel from "./Flavor.model";
import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { FlavorSearchableFields } from "./Flavor.constant";
import { IFlavor, TFlavorQuery } from "./Flavor.interface";
import ProductModel from "../Product/Product.model";
import TypeModel from "../Type/Type.model";



const createFlavorService = async (payload: IFlavor) => {
  const { name, typeId } = payload;
  const slug = slugify(name).toLowerCase();
  //set slug
  payload.slug = slug

  //check typeId
  const type = await TypeModel.findById(typeId)
  if (!type) {
    throw new ApiError(404, 'This typeId not found');
  }

  //check flavor is already existed
  const flavor = await FlavorModel.findOne({
    typeId,
    slug
  });

  if (flavor) {
    throw new ApiError(409, 'This flavor is already existed');
  }

  const result = await FlavorModel.create({
    name,
    slug,
    typeId
  })
  return result;
}

const getFlavorsService = async (query: TFlavorQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, FlavorSearchableFields);
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

 
  const result = await FlavorModel.aggregate([
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
  const totalCountResult = await FlavorModel.aggregate([
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

const getFlavorDropDownService = async (typeId: string) => {
  if (!Types.ObjectId.isValid(typeId)) {
    throw new ApiError(400, "typeId must be a valid ObjectId");
  }
  const type = await TypeModel.findById(typeId)
  if (!type) {
    throw new ApiError(404, 'This typeId not found');
  }

  const result = await FlavorModel.find({ typeId }).select("name").sort("-createdAt");
  return result;
};


const updateFlavorService = async (flavorId: string, payload: Partial<IFlavor>) => {
  const { name, typeId } = payload;
  if (!Types.ObjectId.isValid(flavorId)) {
    throw new ApiError(400, "flavorId must be a valid ObjectId")
  }

  const existingFlavor = await FlavorModel.findById(flavorId);
  if (!existingFlavor) {
    throw new ApiError(404, 'This flavorId not found');
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
    const flavorExist = await FlavorModel.findOne({
      _id: { $ne: flavorId },
      typeId: existingFlavor.typeId,
      slug
    })
    if (flavorExist) {
      throw new ApiError(409, 'Sorry! This flavor is already existed');
    }

    //set slug
    payload.slug = slug;
  }

  const result = await FlavorModel.updateOne(
    { _id: flavorId },
    payload
  )

  return result;
}

const deleteFlavorService = async (flavorId: string) => {
    const flavor = await FlavorModel.findById(flavorId)
    if(!flavor){
        throw new ApiError(404, 'This flavorId not found');
    }

    //check if flavorId is associated with Product
    const associateWithProduct = await ProductModel.findOne({
         flavorId
    });
    if(associateWithProduct){
        throw new ApiError(409, 'Failed to delete, This flavor is associated with Product');
    }

    const result = await FlavorModel.deleteOne({ _id: flavorId})
    return result;
}



export {
    createFlavorService,
    getFlavorsService,
    getFlavorDropDownService,
    updateFlavorService,
    deleteFlavorService
}