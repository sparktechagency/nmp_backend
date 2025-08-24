import { makeFilterQuery, makeSearchQuery } from "../../../helper/QueryBuilder";
import { ProductSearchableFields } from "../Product.constant";
import { TProductQuery } from "../Product.interface";
import ProductModel from "../Product.model";


const GetProductsService = async (query: TProductQuery) => {
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
        searchQuery = makeSearchQuery(searchTerm, ProductSearchableFields);
    }

    //5 setup filters
    let filterQuery = {};
    if (filters) {
        filterQuery = makeFilterQuery(filters);
    }
    const result = await ProductModel.aggregate([
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
                localField: "_id",
                foreignField: "productId",
                as: "reviews",
            },
        },
        {
            $addFields: {
                totalReview: { $size: "$reviews" },
            },
        },
        { $sort: { [sortBy]: sortDirection } },
        {
            $project: {
                _id: 1,
                name: 1,
                category: "$category.name",
                brand: "$brand.name",
                flavor: "$flavor.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                isFeatured: "$isFeatured",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                image: "$image",
                status: "$status",
                stockStatus: "$stockStatus"
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
                status: "$status",
                stockStatus: "$stockStatus"
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
};


export default GetProductsService;