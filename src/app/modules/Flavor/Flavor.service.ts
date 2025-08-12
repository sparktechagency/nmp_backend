import slugify from "slugify";
import ApiError from "../../errors/ApiError";
import FlavorModel from "./Flavor.model";
import { Types } from "mongoose";
// import ProductModel from "../Product/Product.model";
import { makeSearchQuery } from "../../helper/QueryBuilder";
import { FlavorSearchableFields } from "./Flavor.constant";
import { TFlavorQuery } from "./Flavor.interface";



const createFlavorService = async (name: string) => {
    const slug = slugify(name).toLowerCase();
    
    //check flavor is already existed
    const flavor = await FlavorModel.findOne({
        slug
    });

    if(flavor){
        throw new ApiError(409, 'This flavor is already existed');
    }

    const result = await FlavorModel.create({
         name,
         slug
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

 
  const result = await FlavorModel.aggregate([
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
  const totalCountResult = await FlavorModel.aggregate([
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

const getFlavorDropDownService = async () => {
    const result = await FlavorModel.find().select('-createdAt -updatedAt -slug').sort('-createdAt');
    return result;
}


const updateFlavorService = async (flavorId: string, name: string) => {
    if (!Types.ObjectId.isValid(flavorId)) {
        throw new ApiError(400, "flavorId must be a valid ObjectId")
    }

    const existingFlavor = await FlavorModel.findById(flavorId);
    if (!existingFlavor) {
        throw new ApiError(404, 'This flavorId not found');
    }

    const slug = slugify(name).toLowerCase();
    const flavorExist = await FlavorModel.findOne({
        _id: { $ne: flavorId },
        slug
    })
    if (flavorExist) {
        throw new ApiError(409, 'Sorry! This flavor is already existed');
    }

    const result = await FlavorModel.updateOne(
        { _id: flavorId },
        {
            name,
            slug
        }
    )

    return result;
}

const deleteFlavorService = async (flavorId: string) => {
    const flavor = await FlavorModel.findById(flavorId)
    if(!flavor){
        throw new ApiError(404, 'This flavorId not found');
    }

    //check if flavorId is associated with Product
    // const associateWithProduct = await ProductModel.findOne({
    //      flavorId
    // });
    // if(associateWithProduct){
    //     throw new ApiError(409, 'Failed to delete, This flavor is associated with Product');
    // }

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