import { Types } from "mongoose";
import ApiError from "../../../errors/ApiError";
import ProductModel from "../Product.model";
import ObjectId from "../../../utils/ObjectId";


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
                categoryId: "$categoryId",
                category: "$category.name",
                brandId: "$brandId",
                brand: "$brand.name",
                flavorId: "$flavorId",
                flavor: "$flavor.name",
                currentPrice: "$currentPrice",
                originalPrice: "$originalPrice",
                discount: "$discount",
                ratings: "$ratings",
                totalReview: "$totalReview",
                image: "$image",
                introduction: "$introduction",
                description: "$description",
                status: "$status",
                stockStatus: "$stockStatus"
            },
        },
    ]);

    if (product.length === 0) {
        throw new ApiError(404, 'Product Not Found');
    }

    return product[0];

};

export default getProductService;
