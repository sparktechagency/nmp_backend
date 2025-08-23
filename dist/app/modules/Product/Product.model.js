"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    brandId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Brand"
    },
    flavorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Flavor"
    },
    currentPrice: {
        type: Number,
        required: true,
        trim: true
    },
    originalPrice: {
        type: Number,
        default: 0,
        trim: true
    },
    discount: {
        type: String,
        default: ""
    },
    ratings: {
        type: Number,
        trim: true,
        default: 0,
        max: 5
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    total_sold: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['visible', 'hidden'],
        default: "visible"
    },
    stockStatus: {
        type: String,
        enum: ['in_stock', 'stock_out', 'up_coming'],
        default: "in_stock"
    },
}, {
    timestamps: true,
    versionKey: false
});
const ProductModel = (0, mongoose_1.model)('Product', productSchema);
exports.default = ProductModel;
