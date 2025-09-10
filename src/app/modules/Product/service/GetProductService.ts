import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import ProductModel from "../Product.model";
import ObjectId from "../../../utils/ObjectId";
import getStockStatus from "../../../utils/getStockStatus";


const getProductService = async (productId: string) => {
    if (!Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "productId must be a valid ObjectId")
    }

    const product = await ProductModel.aggregate([
        {
            $match: { _id: new ObjectId(productId) }
        },
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
                "path": "$brand",
                'preserveNullAndEmptyArrays': true, //when brandId is empty or null
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
                typeId: 1,
                type: "$type.name",
                categoryId: "$categoryId",
                category: "$category.name",
                brandId: {
                    $cond: {
                        if: { $or: [{ $eq: ["$brandId", null] }, { $not: ["$brandId"] }] }, //if brandId=== null or empty(not exist)
                        then: "",
                        else: "$brandId"
                    }
                },
                brand: {
                    $cond: {
                        if: { $or: [{ $eq: ["$brandId", null] }, { $not: ["$brandId"] }] }, //if brandId=== null or empty(not exist)
                        then: "",
                        else: "$brand.name"
                    }
                },
                flavorId: {
                    $cond: {
                        if: { $or: [{ $eq: ["$flavorId", null] }, { $not: ["$flavorId"] }] }, //if flavorId=== null or empty(not exist)
                        then: "",
                        else: "$flavorId"
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
                isFeatured: "$isFeatured",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                total_sold: "$total_sold",
                image: "$image",
                description: "$description",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
    ]);

    if (product.length === 0) {
        throw new ApiError(404, 'Product Not Found');
    }

    return {
        ...product[0],
        stockStatus: getStockStatus(product[0].quantity)
    };

};

export default getProductService;
