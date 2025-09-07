import { Types } from "mongoose";
import { makeFilterQuery, makeSearchQuery } from "../../../helper/QueryBuilder";
import { ProductSearchableFields } from "../Product.constant";
import { TProductQuery } from "../Product.interface";
import ApiError from "../../../errors/ApiError";
import hasDuplicates from "../../../utils/hasDuplicates";
import ProductModel from "../Product.model";
import TypeModel from "../../Type/Type.model";



const GetUserProductsService = async (query: TProductQuery) => {
    const {
        searchTerm,
        page = 1,
        limit = 10,
        sortOrder = "desc",
        sortBy = "createdAt",
        ratings,
        typeId,
        categoryId,
        brandId,
        flavorId,
        fromPrice,
        toPrice,
        ...filters  // Any additional filters
    } = query;



    // 2. Set up pagination
    const skip = (Number(page) - 1) * Number(limit);

    //3. setup sorting
    // const sortDirection = sortOrder === "asc" ? 1 : -1;

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
    if (!typeId) {
      throw new ApiError(400, "typeId is required");
    }
    if (!Types.ObjectId.isValid(typeId)) {
      throw new ApiError(400, "typeId must be a valid ObjectId");
    }

    const type = await TypeModel.findById(typeId);
    if (!type) {
      throw new ApiError(404, "This typeId not found");
    }


    //filter by category
    if (categoryId) {
        if (typeof categoryId === "string") {
            //check ObjectId
            if (!Types.ObjectId.isValid(categoryId)) {
                throw new ApiError(400, "categoryId must be valid ObjectId")
            }
            filterQuery = {
                ...filterQuery,
                categoryId: { $in: [new Types.ObjectId(categoryId)] }
            }
        }

        if (Array.isArray(categoryId)) {
            for (let i = 0; i < categoryId.length; i++) {
                if (!Types.ObjectId.isValid(categoryId[i])) {
                    throw new ApiError(400, "categoryId must be valid ObjectId")
                }
            }
            if (hasDuplicates(categoryId)) {
                throw new ApiError(400, "categoryId can not be duplicate value")
            }
            const categoryObjectIds = categoryId?.map(id => Types.ObjectId.createFromHexString(id));
            filterQuery = {
                ...filterQuery,
                categoryId: { $in: categoryObjectIds }
            }
        }
    }


    //filter by brand
    if (brandId) {
        if (typeof brandId === "string") {
            //check ObjectId
            if (!Types.ObjectId.isValid(brandId)) {
                throw new ApiError(400, "brandId must be valid ObjectId")
            }
            filterQuery = {
                ...filterQuery,
                brandId: { $in: [new Types.ObjectId(brandId)] }
            }
        }

        if (Array.isArray(brandId)) {
            for (let i = 0; i < brandId.length; i++) {
                if (!Types.ObjectId.isValid(brandId[i])) {
                    throw new ApiError(400, "brandId must be valid ObjectId")
                }
            }
            if (hasDuplicates(brandId)) {
                throw new ApiError(400, "brandId can not be duplicate value")
            }
            const brandObjectIds = brandId?.map(id => Types.ObjectId.createFromHexString(id));
            filterQuery = {
                ...filterQuery,
                brandId: { $in: brandObjectIds }
            }
        }
    }


    //filter by flavor
    if (flavorId) {
        if (typeof flavorId === "string") {
            //check ObjectId
            if (!Types.ObjectId.isValid(flavorId)) {
                throw new ApiError(400, "flavorId must be valid ObjectId")
            }
            filterQuery = {
                ...filterQuery,
                flavorId: { $in: [new Types.ObjectId(flavorId)] }
            }
        }

        if (Array.isArray(flavorId)) {
            for (let i = 0; i < flavorId.length; i++) {
                if (!Types.ObjectId.isValid(flavorId[i])) {
                    throw new ApiError(400, "flavorId must be valid ObjectId")
                }
            }
            if (hasDuplicates(flavorId)) {
                throw new ApiError(400, "flavorId can not be duplicate value")
            }
            const flavorObjectIds = flavorId?.map(id => Types.ObjectId.createFromHexString(id));
            filterQuery = {
                ...filterQuery,
                flavorId: { $in: flavorObjectIds }
            }
        }
    }



    //filter by ratings
    if (ratings) {
        if (typeof Number(ratings) !== "number" || isNaN(Number(ratings))) {
            throw new ApiError(400, "ratings must be a valid number");
        }
        if (Number(ratings) > 5) {
            throw new ApiError(400, "ratings value must be between 1-5");
        }
        if (Number(ratings) > 0) {
            filterQuery = {
                ...filterQuery,
                ratings: Number(ratings)
            }
        }
    }


    //filter by price range
    if (fromPrice && toPrice) {
        if (typeof Number(fromPrice) !== "number" || isNaN(Number(fromPrice))) {
            throw new ApiError(400, "fromPrice must be a valid number");
        }
        if (typeof Number(toPrice) !== "number" || isNaN(Number(toPrice))) {
            throw new ApiError(400, "toPrice must be a valid number");
        }

        if (Number(fromPrice) >= Number(toPrice)) {
            throw new ApiError(400, "toPrice must be greater than fromPrice");
        }

        if (Number(fromPrice) >= 0 && Number(toPrice) > 0) {
            filterQuery = {
                ...filterQuery,
                currentPrice: { $gte: Number(fromPrice), $lte: Number(toPrice) },
            };
        }
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
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                brandId: 1,
                flavorId: 1,
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
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
                status: "visible"
            }
        },
        {
            $project: {
                categoryId: 0,
                brandId: 0,
                flavorId: 0,
                status: 0,
            }
        },
        { $sort: { ratings: -1 } },
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
        {
            $project: {
                _id: 1,
                name: 1,
                categoryId: 1,
                brandId: 1,
                flavorId: 1,
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
        {
            $match: {
                ...searchQuery,
                ...filterQuery,
                status: "visible"
            }
        },
        { $count: "totalCount" }
    ])

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


export default GetUserProductsService;