import ProductModel from "../Product.model";


const GetExportProductsService = async () => {
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
        { $sort: { createdAt: -1 } },
        {
            $project: {
                _id: 1,
                name: 1,
                type: "$type.name",
                category: "$category.name",
                brand: {
                    $cond: {
                        if: { $or: [{ $eq: ["$brandId", null] }, { $not: ["$brandId"] }] }, //if brandId=== null or empty(not exist)
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
                quantity: "$quantity",
                ratings: "$ratings",
                image: "$image",
                status: "$status"
            },
        }
    ]);

    return result;
};


export default GetExportProductsService;