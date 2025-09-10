import { Types } from "mongoose";
import { TProductQuery } from "../Product.interface";
import ProductModel from "../Product.model";
import ApiError from "../../../errors/ApiError";

const GetFeatureProductsService = async (query: TProductQuery) => {
    const {
        page = 1,
        limit = 10,
        typeId,
    } = query;

    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //5 setup filters
    let filterQuery = {};

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
            $match: {
                isFeatured: true,
                ...filterQuery
            }
        },
        { $sort: { createdAt: -1 } },
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
        {
            $project: {
                _id: 1,
                name: 1,
                type: "$type.name",
                category: "$category.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                quantity: "$quantity",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                image: "$image",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
        { $skip: skip },
        { $limit: Number(limit) },
    ]);


     // total count
    const totalCountResult = await ProductModel.aggregate([
        {
            $match: {
                isFeatured: true,
                 ...filterQuery
            }
        },
        { $limit: 20 },
        { $count: "totalCount" }
    ]);

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

}

export default GetFeatureProductsService