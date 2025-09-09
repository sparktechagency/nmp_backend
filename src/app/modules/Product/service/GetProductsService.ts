import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import { makeFilterQuery, makeSearchQuery } from "../../../helper/QueryBuilder";
import { ProductSearchableFields } from "../Product.constant";
import { TProductQuery } from "../Product.interface";
import ProductModel from "../Product.model";
import getStockStatus from "../../../utils/getStockStatus";


const GetProductsService = async (query: TProductQuery) => {
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
        searchQuery = makeSearchQuery(searchTerm, ProductSearchableFields);
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


    const result = await ProductModel.aggregate([
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
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
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
            $unwind: {
                "path": "$flavor",
                'preserveNullAndEmptyArrays': true, //when flavorId is empty or null
            }
        },
        {
            $lookup: {
                from: "reviews",
                let: { productId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$productId", "$$productId"] } } },
                    { $count: "count" }
                ],
                as: "reviewCount"
            }
        },
        {
            $addFields: {
                totalReview: { $ifNull: [{ $arrayElemAt: ["$reviewCount.count", 0] }, 0] }
            }
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                _id: 1,
                name: 1,
                typeId:1,
                type: "$type.name",
                category: "$category.name",
                brand: {
                    $cond: {
                        if: { $or: [{ $eq: ["$brandId", null] }, { $not: ["$brandId"] }]}, //if brandId=== null or empty(not exist)
                        then: "",
                        else: "$brand.name"
                    }
                },
                flavor: {
                    $cond: {
                        if: { $or: [{ $eq: ["$flavorId", null] }, { $not: ["$flavorId"] }] }, //if flavorId=== null or empty(not exist)
                        then: "",
                        else: "$flavor.name"
                    }
                },
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                quantity: "$quantity",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                image: "$image",
                status: "$status"
            },
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
            }
        },
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
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
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
            $unwind: {
                "path": "$flavor",
                'preserveNullAndEmptyArrays': true, //when flavorId is empty or null
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                typeId:1,
                category: "$category.name",
                brand: {
                    $cond: {
                        if: { $or: [{ $eq: ["$brandId", null] }, { $not: ["$brandId"] }]}, //if brandId=== null or empty(not exist)
                        then: "",
                        else: "$brand.name"
                    }
                },
                flavor: {
                    $cond: {
                        if: { $or: [{ $eq: ["$flavorId", null] }, { $not: ["$flavorId"] }] }, //if flavorId=== null or empty(not exist)
                        then: "",
                        else: "$flavor.name"
                    }
                },
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                quantity: "$quantity",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                image: "$image",
                status: "$status"
            },
        },
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
            }
        },
        { $count: "totalCount" }
    ]);


    const modifiedResult = result?.length > 0 ? result?.map((cv)=>({
        ...cv,
        typeId:undefined,
        stockStatus: getStockStatus(cv.quantity)
    })): []

    const totalCount = totalCountResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / Number(limit));

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            totalPages,
            total: totalCount,
        },
        data: modifiedResult,
    };
};


export default GetProductsService;