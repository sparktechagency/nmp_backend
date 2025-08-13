"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },
    image: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});
const CartModel = (0, mongoose_1.model)('Cart', cartSchema);
exports.default = CartModel;
