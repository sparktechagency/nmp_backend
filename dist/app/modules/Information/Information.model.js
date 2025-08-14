"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const informationSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    instagram: {
        type: String,
        required: true,
        trim: true
    },
    telegram: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: false,
    versionKey: false
});
const InformationModel = (0, mongoose_1.model)('Information', informationSchema);
exports.default = InformationModel;
