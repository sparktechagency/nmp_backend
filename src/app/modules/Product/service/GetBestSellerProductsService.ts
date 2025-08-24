import { TProductQuery } from "../Product.interface";
import ProductModel from "../Product.model";

const GetBestSellerProductsService = async (query: TProductQuery) => {
    const {
        page = 1,
        limit = 10,
    } = query;

    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    const result = await ProductModel.aggregate([
        { $sort: { total_sold: -1 } },
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
                category: "$category.name",
                brand: "$brand.name",
                flavor: "$flavor.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
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
        { $sort: { total_sold: -1 } },
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

export default GetBestSellerProductsService